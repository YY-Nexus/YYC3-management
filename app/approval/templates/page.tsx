"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  PlusCircle,
  Search,
  MoreVertical,
  Edit,
  Copy,
  Trash,
  ArrowLeft,
  Calendar,
  CreditCard,
  ShoppingCart,
  FileText,
  Clock,
  GraduationCap,
  Plane,
  Laptop,
} from "lucide-react"
import { approvalTemplates, getTemplateCategories, type ApprovalTemplate } from "@/data/approval-templates"
import { ConfirmDeleteDialog } from "@/components/approval/confirm-delete-dialog"

export default function TemplateManagementPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [templateInfo, setTemplateInfo] = useState<ApprovalTemplate | null>(null)

  const categories = ["all", ...getTemplateCategories()]

  // 根据搜索查询和活动标签过滤模板
  const filteredTemplates = approvalTemplates.filter((template) => {
    const matchesSearch = searchQuery
      ? template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesCategory = activeTab === "all" || template.category === activeTab

    return matchesSearch && matchesCategory
  })

  // 获取图标组件
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "calendar":
        return <Calendar className="h-5 w-5" />
      case "credit-card":
        return <CreditCard className="h-5 w-5" />
      case "shopping-cart":
        return <ShoppingCart className="h-5 w-5" />
      case "file-text":
        return <FileText className="h-5 w-5" />
      case "clock":
        return <Clock className="h-5 w-5" />
      case "graduation-cap":
        return <GraduationCap className="h-5 w-5" />
      case "plane":
        return <Plane className="h-5 w-5" />
      case "laptop":
        return <Laptop className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  // 处理编辑模板
  const handleEditTemplate = (templateId: string) => {
    router.push(`/approval/templates/edit/${templateId}`)
  }

  // 处理复制模板
  const handleDuplicateTemplate = (templateId: string) => {
    router.push(`/approval/templates/duplicate/${templateId}`)
  }

  // 处理删除模板
  const handleDeleteTemplate = (templateId: string) => {
    setTemplateToDelete(templateId)
    setIsDeleteDialogOpen(true)
  }

  // 确认删除模板
  const confirmDeleteTemplate = () => {
    // 在实际应用中，这里应该调用API删除模板
    console.log(`删除模板: ${templateToDelete}`)
    setIsDeleteDialogOpen(false)
    setTemplateToDelete(null)
    // 这里应该刷新模板列表
  }

  // 查看模板详情
  const handleViewTemplateInfo = (template: ApprovalTemplate) => {
    setTemplateInfo(template)
    setIsInfoDialogOpen(true)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/approval")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">返回</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">模板管理</h1>
            <p className="text-muted-foreground">管理审批模板</p>
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
          <Button onClick={() => router.push("/approval/templates/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
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
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {getIconComponent(template.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{template.name}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
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
                            <span className="text-xs text-muted-foreground">{template.fields.length} 个字段</span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t px-4 py-2 bg-muted/30 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          审批流程: {template.approvers.join(" → ")}
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
          </TabsContent>
        </Tabs>
      </div>

      {/* 删除确认对话框 */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="删除模板"
        description="您确定要删除此模板吗？此操作无法撤销，所有使用此模板的审批流程将受到影响。"
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
                  {getIconComponent(templateInfo.icon)}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{templateInfo.name}</h3>
                  <Badge variant="outline">{templateInfo.category}</Badge>
                </div>
              </div>

              <p className="text-muted-foreground">{templateInfo.description}</p>

              <div>
                <h4 className="font-medium mb-2">审批流程</h4>
                <div className="flex items-center gap-2">
                  {templateInfo.approvers.map((approver, index) => (
                    <div key={index} className="flex items-center">
                      <Badge variant="secondary">{approver}</Badge>
                      {index < templateInfo.approvers.length - 1 && <ArrowLeft className="h-4 w-4 mx-1 rotate-180" />}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">字段列表</h4>
                <div className="space-y-2">
                  {templateInfo.fields.map((field) => (
                    <div key={field.id} className="border rounded-md p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{field.label}</span>
                        <Badge variant="outline">{field.type}</Badge>
                      </div>
                      {field.description && <p className="text-xs text-muted-foreground mt-1">{field.description}</p>}
                      <div className="flex gap-2 mt-2">
                        {field.required && <Badge variant="secondary">必填</Badge>}
                        {field.options && <Badge variant="outline">{field.options.length} 个选项</Badge>}
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
