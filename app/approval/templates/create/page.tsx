"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Calendar, FileText } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { ApprovalTemplate } from "@/data/approval-templates"

export default function CreateTemplatePage() {
  const router = useRouter()

  const [template, setTemplate] = useState<ApprovalTemplate>({
    id: uuidv4(),
    name: "",
    description: "",
    icon: "file-text",
    category: "人事",
    fields: [],
    approvers: ["直属主管"],
    estimatedDuration: 24,
  })

  // 处理基本信息变更
  const handleBasicInfoChange = (field: keyof ApprovalTemplate, value: any) => {
    setTemplate({
      ...template,
      [field]: value,
    })
  }

  // 处理审批人变更
  const handleApproversChange = (value: string) => {
    const approvers = value
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean)
    setTemplate({
      ...template,
      approvers,
    })
  }

  // 保存模板
  const handleSaveTemplate = async () => {
    // 验证必填项
    if (!template.name.trim()) {
      alert("请填写模板名称")
      return
    }

    try {
      // 在实际应用中，这里应该调用API保存模板
      console.log("创建模板:", template)

      // 保存成功后跳转到编辑页面
      router.push(`/approval/templates/edit/${template.id}`)
    } catch (error) {
      console.error("创建模板失败:", error)
    }
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
              <h1 className="text-2xl font-bold tracking-tight">创建模板</h1>
              <p className="text-muted-foreground">创建新的审批模板</p>
            </div>
          </div>
          <Button onClick={handleSaveTemplate}>
            <Save className="mr-2 h-4 w-4" />
            创建并编辑
          </Button>
        </div>

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
                  placeholder="例如：请假申请"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Select value={template.category} onValueChange={(value) => handleBasicInfoChange("category", value)}>
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
                placeholder="例如：用于员工请假的标准流程"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">图标</Label>
                <Select value={template.icon} onValueChange={(value) => handleBasicInfoChange("icon", value)}>
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="选择图标">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>file-text</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calendar" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>calendar</span>
                    </SelectItem>
                    <SelectItem value="file-text" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>file-text</span>
                    </SelectItem>
                    {/* 其他图标选项 */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvers">审批人（用逗号分隔）</Label>
                <Input
                  id="approvers"
                  value={template.approvers.join(", ")}
                  onChange={(e) => handleApproversChange(e.target.value)}
                  placeholder="例如：直属主管, 部门经理"
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

            <p className="text-sm text-muted-foreground pt-4">创建模板后，您可以添加表单字段和设置更详细的审批流程。</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
