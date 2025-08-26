"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Save, Trash2, Settings, FileCode, Box } from "lucide-react"
import { NodePropertiesPanel } from "./node-properties-panel"
import { TemplatePropertiesPanel } from "./template-properties-panel"
import { NodeToolbox } from "./node-toolbox"
import type { AdvancedWorkflowTemplate, AdvancedWorkflowNode } from "@/lib/types/advanced-workflow-types"

// 自定义节点组件
import { TaskNode } from "./nodes/task-node"
import { ConditionNode } from "./nodes/condition-node"
import { ForkNode } from "./nodes/fork-node"
import { JoinNode } from "./nodes/join-node"
import { LoopStartNode } from "./nodes/loop-start-node"
import { LoopEndNode } from "./nodes/loop-end-node"

// 注册自定义节点类型
const nodeTypes = {
  task: TaskNode,
  condition: ConditionNode,
  fork: ForkNode,
  join: JoinNode,
  loop_start: LoopStartNode,
  loop_end: LoopEndNode,
}

interface AdvancedWorkflowDesignerProps {
  initialTemplate?: AdvancedWorkflowTemplate
  onSave: (template: AdvancedWorkflowTemplate) => void
}

export function AdvancedWorkflowDesigner({ initialTemplate, onSave }: AdvancedWorkflowDesignerProps) {
  // 初始化模板
  const [template, setTemplate] = useState<AdvancedWorkflowTemplate>(
    initialTemplate || {
      id: `template-${Date.now()}`,
      name: "新工作流模板",
      description: "",
      category: "通用",
      nodes: [],
      startNodeId: "",
      variables: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "当前用户",
      version: 1,
      isPublished: false,
    },
  )

  // 初始化节点和边
  const initialNodes: Node[] = template.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: { x: node.x || 0, y: node.y || 0 },
    data: { ...node },
  }))

  // 根据节点关系创建边
  const initialEdges: Edge[] = []
  template.nodes.forEach((node) => {
    if (node.type === "task" && node.nextNode) {
      initialEdges.push({
        id: `${node.id}-${node.nextNode}`,
        source: node.id,
        target: node.nextNode,
        markerEnd: { type: MarkerType.ArrowClosed },
      })
    } else if (node.type === "condition") {
      if (node.trueTarget) {
        initialEdges.push({
          id: `${node.id}-${node.trueTarget}-true`,
          source: node.id,
          target: node.trueTarget,
          label: "是",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "#22c55e" },
        })
      }
      if (node.falseTarget) {
        initialEdges.push({
          id: `${node.id}-${node.falseTarget}-false`,
          source: node.id,
          target: node.falseTarget,
          label: "否",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "#ef4444" },
        })
      }
    } else if (node.type === "fork" && node.branches) {
      node.branches.forEach((targetId, index) => {
        initialEdges.push({
          id: `${node.id}-${targetId}`,
          source: node.id,
          target: targetId,
          label: `分支 ${index + 1}`,
          markerEnd: { type: MarkerType.ArrowClosed },
        })
      })
    } else if (node.type === "loop_start" && node.loopTarget) {
      initialEdges.push({
        id: `${node.id}-${node.loopTarget}`,
        source: node.id,
        target: node.loopTarget,
        label: "循环体",
        markerEnd: { type: MarkerType.ArrowClosed },
      })
    } else if (node.type === "loop_end") {
      if (node.nextNode) {
        initialEdges.push({
          id: `${node.id}-${node.nextNode}`,
          source: node.id,
          target: node.nextNode,
          label: "退出循环",
          markerEnd: { type: MarkerType.ArrowClosed },
        })
      }
    }
  })

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<AdvancedWorkflowNode | null>(null)
  const [activeTab, setActiveTab] = useState("design")
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // 处理连接
  const onConnect = useCallback(
    (connection: Connection) => {
      // 创建新的边
      const newEdge = {
        ...connection,
        id: `${connection.source}-${connection.target}`,
        markerEnd: { type: MarkerType.ArrowClosed },
      }

      // 更新节点之间的关系
      const sourceNode = template.nodes.find((n) => n.id === connection.source)
      const targetNode = template.nodes.find((n) => n.id === connection.target)

      if (sourceNode && targetNode) {
        const updatedNodes = [...template.nodes]
        const sourceIndex = updatedNodes.findIndex((n) => n.id === sourceNode.id)

        if (sourceNode.type === "task") {
          updatedNodes[sourceIndex] = { ...sourceNode, nextNode: targetNode.id }
        } else if (sourceNode.type === "condition") {
          // 条件节点需要指定是true还是false分支
          // 这里简化处理，实际应该弹出对话框让用户选择
          if (!sourceNode.trueTarget) {
            updatedNodes[sourceIndex] = { ...sourceNode, trueTarget: targetNode.id }
            newEdge.label = "是"
            newEdge.style = { stroke: "#22c55e" }
          } else if (!sourceNode.falseTarget) {
            updatedNodes[sourceIndex] = { ...sourceNode, falseTarget: targetNode.id }
            newEdge.label = "否"
            newEdge.style = { stroke: "#ef4444" }
          }
        } else if (sourceNode.type === "fork") {
          const branches = sourceNode.branches || []
          updatedNodes[sourceIndex] = { ...sourceNode, branches: [...branches, targetNode.id] }
          newEdge.label = `分支 ${branches.length + 1}`
        } else if (sourceNode.type === "loop_start") {
          updatedNodes[sourceIndex] = { ...sourceNode, loopTarget: targetNode.id }
          newEdge.label = "循环体"
        } else if (sourceNode.type === "loop_end") {
          updatedNodes[sourceIndex] = { ...sourceNode, nextNode: targetNode.id }
          newEdge.label = "退出循环"
        }

        setTemplate({ ...template, nodes: updatedNodes })
      }

      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges, template],
  )

  // 处理节点点击
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    const workflowNode = template.nodes.find((n) => n.id === node.id)
    if (workflowNode) {
      setSelectedNode(workflowNode)
    }
  }

  // 处理节点拖拽
  const onNodeDragStop = (_: React.MouseEvent, node: Node) => {
    const updatedNodes = template.nodes.map((n) => {
      if (n.id === node.id) {
        return { ...n, x: node.position.x, y: node.position.y }
      }
      return n
    })
    setTemplate({ ...template, nodes: updatedNodes })
  }

  // 添加新节点
  const addNode = (type: string) => {
    const newNode: AdvancedWorkflowNode = {
      id: `node-${Date.now()}`,
      type: type as any,
      title: `新${getNodeTypeName(type)}`,
      description: "",
      x: 100,
      y: 100,
    }

    // 如果是第一个节点，设置为起始节点
    if (template.nodes.length === 0) {
      setTemplate({
        ...template,
        nodes: [...template.nodes, newNode],
        startNodeId: newNode.id,
      })
    } else {
      setTemplate({
        ...template,
        nodes: [...template.nodes, newNode],
      })
    }

    // 添加到ReactFlow
    setNodes((nds) => [
      ...nds,
      {
        id: newNode.id,
        type: newNode.type,
        position: { x: newNode.x || 0, y: newNode.y || 0 },
        data: { ...newNode },
      },
    ])

    // 选中新节点
    setSelectedNode(newNode)
  }

  // 更新节点属性
  const updateNodeProperties = (updatedNode: AdvancedWorkflowNode) => {
    const updatedNodes = template.nodes.map((node) => {
      if (node.id === updatedNode.id) {
        return updatedNode
      }
      return node
    })

    setTemplate({ ...template, nodes: updatedNodes })

    // 更新ReactFlow节点
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === updatedNode.id) {
          return {
            ...node,
            data: { ...updatedNode },
          }
        }
        return node
      }),
    )
  }

  // 删除节点
  const deleteNode = (nodeId: string) => {
    // 更新模板
    const updatedNodes = template.nodes.filter((node) => node.id !== nodeId)
    let updatedStartNodeId = template.startNodeId
    if (template.startNodeId === nodeId) {
      updatedStartNodeId = updatedNodes.length > 0 ? updatedNodes[0].id : ""
    }

    setTemplate({
      ...template,
      nodes: updatedNodes,
      startNodeId: updatedStartNodeId,
    })

    // 更新ReactFlow
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))

    // 清除选中状态
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null)
    }
  }

  // 更新模板属性
  const updateTemplateProperties = (updatedTemplate: Partial<AdvancedWorkflowTemplate>) => {
    setTemplate({ ...template, ...updatedTemplate })
  }

  // 保存模板
  const saveTemplate = () => {
    // 更新坐标
    const updatedNodes = template.nodes.map((node) => {
      const flowNode = nodes.find((n) => n.id === node.id)
      if (flowNode) {
        return { ...node, x: flowNode.position.x, y: flowNode.position.y }
      }
      return node
    })

    const finalTemplate = {
      ...template,
      nodes: updatedNodes,
      updatedAt: new Date().toISOString(),
    }

    onSave(finalTemplate)
  }

  // 获取节点类型名称
  const getNodeTypeName = (type: string) => {
    switch (type) {
      case "task":
        return "任务"
      case "condition":
        return "条件"
      case "fork":
        return "分支"
      case "join":
        return "合并"
      case "loop_start":
        return "循环开始"
      case "loop_end":
        return "循环结束"
      default:
        return "节点"
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Input
            className="text-xl font-bold w-[300px]"
            value={template.name}
            onChange={(e) => updateTemplateProperties({ name: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveTemplate}>
            <Save className="mr-2 h-4 w-4" />
            保存模板
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="design">
            <Box className="mr-2 h-4 w-4" />
            设计器
          </TabsTrigger>
          <TabsTrigger value="properties">
            <Settings className="mr-2 h-4 w-4" />
            属性
          </TabsTrigger>
          <TabsTrigger value="code">
            <FileCode className="mr-2 h-4 w-4" />
            JSON
          </TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="flex-1 flex">
          <div className="w-64 border-r p-4 overflow-y-auto">
            <NodeToolbox onAddNode={addNode} />
          </div>

          <div className="flex-1 relative" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onNodeDragStop={onNodeDragStop}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>

          {selectedNode && (
            <div className="w-80 border-l p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">节点属性</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNode(selectedNode.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <NodePropertiesPanel
                node={selectedNode}
                allNodes={template.nodes}
                onUpdate={updateNodeProperties}
                isStartNode={template.startNodeId === selectedNode.id}
                onSetAsStart={() => updateTemplateProperties({ startNodeId: selectedNode.id })}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="properties" className="flex-1">
          <TemplatePropertiesPanel template={template} onUpdate={updateTemplateProperties} />
        </TabsContent>

        <TabsContent value="code" className="flex-1">
          <div className="h-full p-4 bg-gray-50 overflow-auto">
            <pre className="text-sm">{JSON.stringify(template, null, 2)}</pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
