"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Copy, Trash, ArrowLeft, Calendar, Clock, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { WorkflowTemplate } from "@/lib/types/workflow-types"
import { ConfirmDialog } from "@/components/workflow/confirm-dialog"

export default function TemplateManagementPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [templateInfo, setTemplateInfo] = useState<WorkflowTemplate | null>(null)

  // 获取模板数据
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch("/api/workflow/templates")
        const data = await response.json()
        setTemplates(data.templates || [])
      } catch (error) {
        console.error("Error fetching templates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  // 获取所有分类
  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category)))]

  // 根据搜索查询和活动标签过滤模板
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = searchQuery
      ? template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesCategory = activeTab === "all" || template.category === activeTab

    return matchesSearch && matchesCategory
  })

  // 处理编辑模板
  const handleEditTemplate = (templateId: string) => {
    router.push(`/workflow/templates/edit/${templateId}`)
  }

  // 处理复制模板
  const handleDuplicateTemplate = (templateId: string) => {
    router.push(`/workflow/templates/duplicate/${templateId}`)
  }

  // 处理删除模板
  const handleDeleteTemplate = (templateId: string) => {
    setTemplateToDelete(templateId)
    setIsDeleteDialogOpen(true)
  }

  // 确认删除模板
  const confirmDeleteTemplate = async () => {
    if (!templateToDelete) return

    try {
      const response = await fetch(`/api/workflow/templates/${templateToDelete}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // 从列表中移除已删除的模板
        setTemplates(templates.filter((t) => t.id !== templateToDelete))
      } else {
        console.error("Error deleting template")
      }
    } catch (error) {
      console.error("Error deleting template:", error)
    } finally {
      setIsDeleteDialogOpen(false)
      setTemplateToDelete(null)
    }
  }

  // 查看模板详情
  const handleViewTemplateInfo = (template: WorkflowTemplate) => {
    setTemplateInfo(template)
    setIsInfoDialogOpen(true)
  }

  // 获取图标组件
  const getIconComponent = (category: string) => {
    switch (category.toLowerCase()) {
      case "日常运营":
        return <Clock className="h-5 w-5" />
      case "盘点管理":
        return <FileText className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/workflow")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">返回</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">工作流模板管理</h1>
            <p className="text-muted-foreground">创建和管理工作流模板</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索模板..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => router.push("/workflow/templates/create")}>
            <Plus className="mr-2 h-4 w-4" />
            创建模板
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === "all" ? "全部" : category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="opacity-50">
                    <CardHeader className="pb-2">
                      <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                    </CardContent>
                    <CardFooter className="border-t p-3 bg-muted/30">
                      <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-medium">未找到模板</h3>
                <p className="text-muted-foreground mt-1">尝试使用不同的搜索词或筛选条件</p>
                <Button className="mt-4" onClick={() => router.push("/workflow/templates/create")}>
                  创建新模板
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4 flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {getIconComponent(template.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{template.name}</h3>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
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
                                      className="lucide lucide-more-vertical"
                                    >
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                    <span className="sr-only">操作</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewTemplateInfo(template)}>
                                    查看详情
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditTemplate(template.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    编辑
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDuplicateTemplate(template.id)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    复制
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteTemplate(template.id)}
                                    className="text-red-600"
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{template.category}</Badge>
                              <span className="text-xs text-muted-foreground">{template.nodes.length} 个节点</span>
                            </div>
                          </div>
                        </div>
                        <div className="border-t px-4 py-2 bg-muted/30 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            创建于 {new Date(template.createdAt).toLocaleDateString("zh-CN")}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7"
                            onClick={() => handleEditTemplate(template.id)}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            编辑
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="删除模板"
        description="您确定要删除此模板吗？此操作无法撤销，所有使用此模板的工作流实例将受到影响。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={confirmDeleteTemplate}
      />

      {/* 模板详情对话框 */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>模板详情</DialogTitle>
            <DialogDescription>查看模板的详细信息</DialogDescription>
          </DialogHeader>

          {templateInfo && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {getIconComponent(templateInfo.category)}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{templateInfo.name}</h3>
                  <Badge variant="outline">{templateInfo.category}</Badge>
                </div>
              </div>

              <p className="text-muted-foreground">{templateInfo.description}</p>

              <div>
                <h4 className="font-medium mb-2">节点列表</h4>
                <div className="space-y-2">
                  {templateInfo.nodes.map((node) => (
                    <div key={node.id} className="border rounded-md p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{node.title}</span>
                        <Badge variant="outline">{node.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">负责人: {node.responsibleLevel}</Badge>
                        <Badge variant="outline">时限: {node.timeLimit}分钟</Badge>
                        {node.dependsOn && node.dependsOn.length > 0 && <Badge variant="outline">有依赖关系</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsInfoDialogOpen(false)}>
                  关闭
                </Button>
                <Button
                  onClick={() => {
                    setIsInfoDialogOpen(false)
                    handleEditTemplate(templateInfo.id)
                  }}
                >
                  编辑模板
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
