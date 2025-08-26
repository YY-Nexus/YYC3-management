"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WorkflowNode } from "@/lib/types/workflow-types"
import ReactFlow, {
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"

interface DependencyVisualizerProps {
  nodes: WorkflowNode[]
  onDependencyChange: (nodeId: string, dependencies: string[]) => void
}

// 自定义节点组件
const CustomNode = ({ data }: { data: any }) => {
  return (
    <Card className="p-3 min-w-[200px] border-2 shadow-md">
      <div className="font-medium text-sm">{data.label}</div>
      <div className="text-xs text-muted-foreground mt-1">{data.category}</div>
      <Badge variant="outline" className="mt-2 text-xs">
        {data.responsibleLevel}
      </Badge>
    </Card>
  )
}

// 注册自定义节点类型
const nodeTypes = {
  custom: CustomNode,
}

export function DependencyVisualizer({ nodes, onDependencyChange }: DependencyVisualizerProps) {
  const [reactFlowNodes, setReactFlowNodes] = useNodesState([])
  const [reactFlowEdges, setReactFlowEdges] = useEdgesState([])
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // 将工作流节点转换为ReactFlow节点
  useEffect(() => {
    const flowNodes = nodes.map((node, index) => ({
      id: node.id,
      type: "custom",
      data: {
        label: node.title,
        category: node.category,
        responsibleLevel: node.responsibleLevel,
      },
      position: {
        x: 100 + (index % 3) * 300,
        y: 100 + Math.floor(index / 3) * 200,
      },
    }))

    setReactFlowNodes(flowNodes)

    // 创建边
    const edges: Edge[] = []
    nodes.forEach((node) => {
      if (node.dependsOn && node.dependsOn.length > 0) {
        node.dependsOn.forEach((sourceId) => {
          edges.push({
            id: `${sourceId}-${node.id}`,
            source: sourceId,
            target: node.id,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: { strokeWidth: 2 },
            animated: true,
          })
        })
      }
    })

    setReactFlowEdges(edges)
  }, [nodes, setReactFlowNodes, setReactFlowEdges])

  // 处理连接
  const onConnect = (connection: Connection) => {
    // 检查是否会形成循环依赖
    if (wouldCreateCycle(connection.source as string, connection.target as string)) {
      alert("无法创建此依赖关系，会导致循环依赖")
      return
    }

    // 添加新边
    const newEdge = {
      ...connection,
      id: `${connection.source}-${connection.target}`,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: { strokeWidth: 2 },
      animated: true,
    }

    setReactFlowEdges((eds) => addEdge(newEdge, eds))

    // 更新依赖关系
    updateDependencies(connection.target as string, connection.source as string, true)
  }

  // 检查是否会形成循环依赖
  const wouldCreateCycle = (sourceId: string, targetId: string): boolean => {
    // 如果目标节点已经依赖于源节点，则会形成循环
    const targetNode = nodes.find((n) => n.id === targetId)
    if (!targetNode) return false

    // 直接循环
    if (targetId === sourceId) return true

    // 检查源节点是否依赖于目标节点（间接循环）
    const checkDependency = (nodeId: string, visited = new Set<string>()): boolean => {
      if (visited.has(nodeId)) return false
      visited.add(nodeId)

      const node = nodes.find((n) => n.id === nodeId)
      if (!node || !node.dependsOn) return false

      if (node.dependsOn.includes(targetId)) return true

      return node.dependsOn.some((depId) => checkDependency(depId, new Set(visited)))
    }

    return checkDependency(sourceId)
  }

  // 处理边删除
  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge)
  }

  // 删除选中的边
  const deleteSelectedEdge = () => {
    if (!selectedEdge) return

    setReactFlowEdges((edges) => edges.filter((e) => e.id !== selectedEdge.id))

    // 更新依赖关系
    updateDependencies(selectedEdge.target, selectedEdge.source, false)

    setSelectedEdge(null)
  }

  // 更新依赖关系
  const updateDependencies = (targetId: string, sourceId: string, add: boolean) => {
    const targetNode = nodes.find((n) => n.id === targetId)
    if (!targetNode) return

    let dependencies = targetNode.dependsOn || []

    if (add) {
      // 添加依赖
      if (!dependencies.includes(sourceId)) {
        dependencies = [...dependencies, sourceId]
      }
    } else {
      // 移除依赖
      dependencies = dependencies.filter((id) => id !== sourceId)
    }

    onDependencyChange(targetId, dependencies)
  }

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <div className="h-full w-full">
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      {selectedEdge && (
        <div className="absolute bottom-4 right-4">
          <Button variant="destructive" onClick={deleteSelectedEdge}>
            删除选中的依赖关系
          </Button>
        </div>
      )}
    </div>
  )
}
