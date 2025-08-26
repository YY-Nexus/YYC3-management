"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Plus,
  Trash,
  GripVertical,
  Save,
  Calendar,
  CreditCard,
  ShoppingCart,
  FileText,
  Clock,
  GraduationCap,
  Plane,
  Laptop,
} from "lucide-react"
import { getTemplateById, type ApprovalTemplate, type ApprovalTemplateField } from "@/data/approval-templates"
import { FieldEditorDialog } from "@/components/approval/field-editor-dialog"
import { ConfirmDeleteDialog } from "@/components/approval/confirm-delete-dialog"

interface PageProps {
  params: {
    id: string
  }
}

export default function EditTemplatePage({ params }: PageProps) {
  const router = useRouter()
  const templateId = params.id

  const [template, setTemplate] = useState<ApprovalTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("basic")
  const [isFieldEditorOpen, setIsFieldEditorOpen] = useState(false)
  const [currentField, setCurrentField] = useState<ApprovalTemplateField | null>(null)
  const [fieldIndex, setFieldIndex] = useState<number | null>(null)
  const [isDeleteFieldDialogOpen, setIsDeleteFieldDialogOpen] = useState(false)
  const [fieldToDelete, setFieldToDelete] = useState<number | null>(null)

  // 加载模板数据
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        // 在实际应用中，这里应该从API获取模板数据
        const templateData = getTemplateById(templateId)
        if (templateData) {
          setTemplate(templateData)
        } else {
          // 模板不存在，返回列表页
          router.push("/approval/templates")
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
  const handleBasicInfoChange = (field: keyof ApprovalTemplate, value: any) => {
    if (!template) return

    setTemplate({
      ...template,
      [field]: value,
    })
  }

  // 处理审批人变更
  const handleApproversChange = (value: string) => {
    if (!template) return

    const approvers = value
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean)
    setTemplate({
      ...template,
      approvers,
    })
  }

  // 打开字段编辑器
  const handleEditField = (field: ApprovalTemplateField, index: number) => {
    setCurrentField(field)
    setFieldIndex(index)
    setIsFieldEditorOpen(true)
  }

  // 添加新字段
  const handleAddField = () => {
    setCurrentField(null)
    setFieldIndex(null)
    setIsFieldEditorOpen(true)
  }

  // 保存字段
  const handleSaveField = (field: ApprovalTemplateField) => {
    if (!template) return

    const newFields = [...template.fields]

    if (fieldIndex !== null) {
      // 更新现有字段
      newFields[fieldIndex] = field
    } else {
      // 添加新字段
      newFields.push(field)
    }

    setTemplate({
      ...template,
      fields: newFields,
    })

    setIsFieldEditorOpen(false)
  }

  // 删除字段
  const handleDeleteField = (index: number) => {
    setFieldToDelete(index)
    setIsDeleteFieldDialogOpen(true)
  }

  // 确认删除字段
  const confirmDeleteField = () => {
    if (!template || fieldToDelete === null) return

    const newFields = template.fields.filter((_, index) => index !== fieldToDelete)

    setTemplate({
      ...template,
      fields: newFields,
    })

    setIsDeleteFieldDialogOpen(false)
    setFieldToDelete(null)
  }

  // 移动字段
  const handleMoveField = (fromIndex: number, toIndex: number) => {
    if (!template) return

    const newFields = [...template.fields]
    const [movedField] = newFields.splice(fromIndex, 1)
    newFields.splice(toIndex, 0, movedField)

    setTemplate({
      ...template,
      fields: newFields,
    })
  }

  // 保存模板
  const handleSaveTemplate = async () => {
    if (!template) return

    try {
      // 在实际应用中，这里应该调用API保存模板
      console.log("保存模板:", template)

      // 保存成功后返回列表页
      router.push("/approval/templates")
    } catch (error) {
      console.error("保存模板失败:", error)
    }
  }

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

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/approval/templates")}>
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
          <Button variant="ghost" size="icon" onClick={() => router.push("/approval/templates")}>
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
            <Button variant="ghost" size="icon" onClick={() => router.push("/approval/templates")}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">返回</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">编辑模板</h1>
              <p className="text-muted-foreground">编辑审批模板</p>
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
            <TabsTrigger value="fields">表单字段</TabsTrigger>
            <TabsTrigger value="workflow">审批流程</TabsTrigger>
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
                        <SelectItem value="人事">人事</SelectItem>
                        <SelectItem value="财务">财务</SelectItem>
                        <SelectItem value="行政">行政</SelectItem>
                        <SelectItem value="法务">法务</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">图标</Label>
                    <Select value={template.icon} onValueChange={(value) => handleBasicInfoChange("icon", value)}>
                      <SelectTrigger id="icon" className="flex items-center">
                        <SelectValue placeholder="选择图标">
                          <div className="flex items-center gap-2">
                            {getIconComponent(template.icon)}
                            <span>{template.icon}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calendar" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>calendar</span>
                        </SelectItem>
                        <SelectItem value="credit-card" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>credit-card</span>
                        </SelectItem>
                        <SelectItem value="shopping-cart" className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          <span>shopping-cart</span>
                        </SelectItem>
                        <SelectItem value="file-text" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>file-text</span>
                        </SelectItem>
                        <SelectItem value="clock" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>clock</span>
                        </SelectItem>
                        <SelectItem value="graduation-cap" className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          <span>graduation-cap</span>
                        </SelectItem>
                        <SelectItem value="plane" className="flex items-center gap-2">
                          <Plane className="h-4 w-4" />
                          <span>plane</span>
                        </SelectItem>
                        <SelectItem value="laptop" className="flex items-center gap-2">
                          <Laptop className="h-4 w-4" />
                          <span>laptop</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">预计审批时长（小时）</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      value={template.estimatedDuration || ""}
                      onChange={(e) =>
                        handleBasicInfoChange("estimatedDuration", e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="popular"
                    checked={!!template.popular}
                    onCheckedChange={(checked) => handleBasicInfoChange("popular", checked)}
                  />
                  <Label htmlFor="popular">设为热门模板</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fields" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>表单字段</CardTitle>
                <Button onClick={handleAddField}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加字段
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {template.fields.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>暂无字段，点击"添加字段"按钮创建</p>
                      </div>
                    ) : (
                      template.fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="border rounded-md p-3 flex items-start gap-2 hover:bg-muted/30 transition-colors"
                        >
                          <div className="p-1 cursor-move">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <span className="font-medium">{field.label}</span>
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </div>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline">{field.type}</Badge>
                                {field.options && <Badge variant="secondary">{field.options.length} 个选项</Badge>}
                              </div>
                            </div>
                            {field.description && (
                              <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditField(field, index)}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">编辑</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDeleteField(index)}
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

          <TabsContent value="workflow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>审批流程</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="approvers">审批人（按顺序，用逗号分隔）</Label>
                  <Textarea
                    id="approvers"
                    value={template.approvers.join(", ")}
                    onChange={(e) => handleApproversChange(e.target.value)}
                    placeholder="例如：直属主管, 部门经理, 总经理"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    按照审批顺序填写审批人，用逗号分隔。例如：直属主管, 部门经理, 总经理
                  </p>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">当前审批流程</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {template.approvers.map((approver, index) => (
                      <div key={index} className="flex items-center">
                        <Badge>{approver}</Badge>
                        {index < template.approvers.length - 1 && <ArrowLeft className="h-4 w-4 mx-1 rotate-180" />}
                      </div>
                    ))}
                  </div>
                </div>
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
                      {template.estimatedDuration && (
                        <span className="text-sm text-muted-foreground">
                          预计审批时长: {template.estimatedDuration}小时
                        </span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">表单字段</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {template.fields.map((field) => (
                        <div
                          key={field.id}
                          className={`border rounded-md p-3 ${field.type === "textarea" ? "md:col-span-2" : ""}`}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </span>
                            <Badge variant="outline">{field.type}</Badge>
                          </div>
                          {field.description && (
                            <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                          )}
                          {field.placeholder && <p className="text-xs italic mt-1">占位符: {field.placeholder}</p>}
                          {field.options && (
                            <div className="mt-2">
                              <span className="text-xs font-medium">选项:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {field.options.map((option, i) => (
                                  <Badge key={i} variant="secondary">
                                    {option}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">审批流程</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {template.approvers.map((approver, index) => (
                        <div key={index} className="flex items-center">
                          <Badge>{approver}</Badge>
                          {index < template.approvers.length - 1 && <ArrowLeft className="h-4 w-4 mx-1 rotate-180" />}
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

      {/* 字段编辑器对话框 */}
      <FieldEditorDialog
        open={isFieldEditorOpen}
        onOpenChange={setIsFieldEditorOpen}
        field={currentField}
        onSave={handleSaveField}
      />

      {/* 删除字段确认对话框 */}
      <ConfirmDeleteDialog
        open={isDeleteFieldDialogOpen}
        onOpenChange={setIsDeleteFieldDialogOpen}
        title="删除字段"
        description="您确定要删除此字段吗？此操作无法撤销。"
        onConfirm={confirmDeleteField}
      />
    </div>
  )
}
