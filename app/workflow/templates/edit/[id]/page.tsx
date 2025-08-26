"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Trash, GripVertical, Save, AlertCircle } from "lucide-react"
import type { WorkflowTemplate, WorkflowNode } from "@/lib/types/workflow-types"
import { NodeEditorDialog } from "@/components/workflow/node-editor-dialog"
import { ConfirmDialog } from "@/components/workflow/confirm-dialog"
import { DependencyVisualizer } from "@/components/workflow/dependency-visualizer"

interface PageProps {
  params: {
    id: string
  }
}

export default function EditTemplatePage({ params }: PageProps) {
  const router = useRouter()
  const templateId = params.id

  const [template, setTemplate] = useState<WorkflowTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("basic")
  const [isNodeEditorOpen, setIsNodeEditorOpen] = useState(false)
  const [currentNode, setCurrentNode] = useState<WorkflowNode | null>(null)
  const [nodeIndex, setNodeIndex] = useState<number | null>(null)
  const [isDeleteNodeDialogOpen, setIsDeleteNodeDialogOpen] = useState(false)
  const [nodeToDelete, setNodeToDelete] = useState<number | null>(null)

  // 加载模板数据
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const response = await fetch(`/api/workflow/templates?id=${templateId}`)
        const data = await response.json()

        if (response.ok && data.template) {
          setTemplate(data.template)
        } else {
          // 模板不存在，返回列表页
          router.push("/workflow/templates")
        }
      } catch (error) {
        console.error("加载模板失败:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTemplate()
  }, [templateId, router])

  // 处理基本信息变更
  const handleBasicInfoChange = (field: keyof WorkflowTemplate, value: any) => {
    if (!template) return

    setTemplate({
      ...template,
      [field]: value,
    })
  }

  // 打开节点编辑器
  const handleEditNode = (node: WorkflowNode, index: number) => {
    setCurrentNode(node)
    setNodeIndex(index)
    setIsNodeEditorOpen(true)
  }

  // 添加新节点
  const handleAddNode = () => {
    setCurrentNode(null)
    setNodeIndex(null)
    setIsNodeEditorOpen(true)
  }

  // 保存节点
  const handleSaveNode = (node: WorkflowNode) => {
    if (!template) return

    const newNodes = [...template.nodes]

    if (nodeIndex !== null) {
      // 更新现有节点
      newNodes[nodeIndex] = node
    } else {
      // 添加新节点
      newNodes.push(node)
    }

    setTemplate({
      ...template,
      nodes: newNodes,
      updatedAt: new Date().toISOString(),
    })

    setIsNodeEditorOpen(false)
  }

  // 删除节点
  const handleDeleteNode = (index: number) => {
    setNodeToDelete(index)
    setIsDeleteNodeDialogOpen(true)
  }

  // 确认删除节点
  const confirmDeleteNode = () => {
    if (!template || nodeToDelete === null) return

    const nodeId = template.nodes[nodeToDelete].id

    // 删除节点
    const newNodes = template.nodes.filter((_, index) => index !== nodeToDelete)

    // 更新依赖关系
    const updatedNodes = newNodes.map((node) => {
      if (node.dependsOn && node.dependsOn.includes(nodeId)) {
        return {
          ...node,
          dependsOn: node.dependsOn.filter((id) => id !== nodeId),
        }
      }
      return node
    })

    setTemplate({
      ...template,
      nodes: updatedNodes,
      updatedAt: new Date().toISOString(),
    })

    setIsDeleteNodeDialogOpen(false)
    setNodeToDelete(null)
  }

  // 保存模板
  const handleSaveTemplate = async () => {
    if (!template) return

    try {
      const response = await fetch(`/api/workflow/templates/${template.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...template,
          updatedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        // 保存成功后返回列表页
        router.push("/workflow/templates")
      } else {
        console.error("保存模板失败")
      }
    } catch (error) {
      console.error("保存模板失败:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/workflow/templates")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">返回</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">加载中...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/workflow/templates")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">返回</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">模板不存在</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/workflow/templates")}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">返回</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">编辑模板</h1>
              <p className="text-muted-foreground">编辑工作流模板</p>
            </div>
          </div>
          <Button onClick={handleSaveTemplate}>
            <Save className="mr-2 h-4 w-4" />
            保存模板
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="nodes">节点管理</TabsTrigger>
            <TabsTrigger value="dependencies">依赖关系</TabsTrigger>
            <TabsTrigger value="preview">预览</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">模板名称</Label>
                    <Input
                      id="name"
                      value={template.name}
                      onChange={(e) => handleBasicInfoChange("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">分类</Label>
                    <Select
                      value={template.category}
                      onValueChange={(value) => handleBasicInfoChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="日常运营">日常运营</SelectItem>
                        <SelectItem value="盘点管理">盘点管理</SelectItem>
                        <SelectItem value="会议管理">会议管理</SelectItem>
                        <SelectItem value="项目管理">项目管理</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">描述</Label>
                  <Textarea
                    id="description"
                    value={template.description}
                    onChange={(e) => handleBasicInfoChange("description", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nodes" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>节点管理</CardTitle>
                <Button onClick={handleAddNode}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加节点
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {template.nodes.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>暂无节点，点击"添加节点"按钮创建</p>
                      </div>
                    ) : (
                      template.nodes.map((node, index) => (
                        <div
                          key={node.id}
                          className="border rounded-md p-3 flex items-start gap-2 hover:bg-muted/30 transition-colors"
                        >
                          <div className="p-1 cursor-move">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{node.title}</span>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline">{node.category}</Badge>
                                <Badge variant="secondary">{node.responsibleLevel}</Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline">时限: {node.timeLimit}分钟</Badge>
                              {node.dependsOn && node.dependsOn.length > 0 && (
                                <Badge variant="outline" className="bg-blue-50">
                                  依赖: {node.dependsOn.length}个节点
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditNode(node, index)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-pencil"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                              <span className="sr-only">编辑</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDeleteNode(index)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">删除</span>
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dependencies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>依赖关系</CardTitle>
              </CardHeader>
              <CardContent>
                {template.nodes.length < 2 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">需要至少两个节点</h3>
                    <p className="text-muted-foreground mt-1">请先添加至少两个节点来设置依赖关系</p>
                    <Button className="mt-4" onClick={() => setActiveTab("nodes")}>
                      管理节点
                    </Button>
                  </div>
                ) : (
                  <div className="h-[500px] w-full">
                    <DependencyVisualizer
                      nodes={template.nodes}
                      onDependencyChange={(nodeId, dependencies) => {
                        const updatedNodes = template.nodes.map((node) => {
                          if (node.id === nodeId) {
                            return {
                              ...node,
                              dependsOn: dependencies,
                            }
                          }
                          return node
                        })

                        setTemplate({
                          ...template,
                          nodes: updatedNodes,
                          updatedAt: new Date().toISOString(),
                        })
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>模板预览</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">{template.name}</h2>
                    <p className="text-muted-foreground">{template.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <span className="text-sm text-muted-foreground">{template.nodes.length} 个节点</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">节点列表</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {template.nodes.map((node) => (
                        <div key={node.id} className="border rounded-md p-3">
                          <div className="flex justify-between">
                            <span className="font-medium">{node.title}</span>
                            <Badge variant="outline">{node.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">负责人: {node.responsibleLevel}</Badge>
                            <Badge variant="outline">时限: {node.timeLimit}分钟</Badge>
                            <Badge variant="outline">提前提醒: {node.reminderBefore}分钟</Badge>
                            <Badge variant="outline">升级时间: {node.escalationAfter}分钟</Badge>
                          </div>
                          {node.dependsOn && node.dependsOn.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs font-medium">依赖节点:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {node.dependsOn.map((depId) => {
                                  const depNode = template.nodes.find((n) => n.id === depId)
                                  return (
                                    <Badge key={depId} variant="secondary">
                                      {depNode ? depNode.title : "未知节点"}
                                    </Badge>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 节点编辑器对话框 */}
      <NodeEditorDialog
        open={isNodeEditorOpen}
        onOpenChange={setIsNodeEditorOpen}
        node={currentNode}
        existingNodes={template.nodes}
        onSave={handleSaveNode}
      />

      {/* 删除节点确认对话框 */}
      <ConfirmDialog
        open={isDeleteNodeDialogOpen}
        onOpenChange={setIsDeleteNodeDialogOpen}
        title="删除节点"
        description="您确定要删除此节点吗？此操作无法撤销，依赖此节点的其他节点也会受到影响。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={confirmDeleteNode}
      />
    </div>
  )
}
