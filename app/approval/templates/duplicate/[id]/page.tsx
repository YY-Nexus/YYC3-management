"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { getTemplateById, type ApprovalTemplate } from "@/data/approval-templates"

interface PageProps {
  params: {
    id: string
  }
}

export default function DuplicateTemplatePage({ params }: PageProps) {
  const router = useRouter()
  const sourceTemplateId = params.id

  const [template, setTemplate] = useState<ApprovalTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")

  // 加载源模板数据
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        // 在实际应用中，这里应该从API获取模板数据
        const sourceTemplate = getTemplateById(sourceTemplateId)
        if (sourceTemplate) {
          // 创建副本，生成新的ID
          const templateCopy = {
            ...sourceTemplate,
            id: uuidv4(),
            name: `${sourceTemplate.name} (副本)`,
            description: sourceTemplate.description,
          }

          setTemplate(templateCopy)
          setNewName(templateCopy.name)
          setNewDescription(templateCopy.description)
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
  }, [sourceTemplateId, router])

  // 保存复制的模板
  const handleSaveTemplate = async () => {
    if (!template) return

    // 验证必填项
    if (!newName.trim()) {
      alert("请填写模板名称")
      return
    }

    try {
      // 更新模板名称和描述
      const updatedTemplate = {
        ...template,
        name: newName,
        description: newDescription,
      }

      // 在实际应用中，这里应该调用API保存模板
      console.log("保存复制的模板:", updatedTemplate)

      // 保存成功后跳转到编辑页面
      router.push(`/approval/templates/edit/${updatedTemplate.id}`)
    } catch (error) {
      console.error("保存模板失败:", error)
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
              <h1 className="text-2xl font-bold tracking-tight">复制模板</h1>
              <p className="text-muted-foreground">创建模板副本</p>
            </div>
          </div>
          <Button onClick={handleSaveTemplate}>
            <Save className="mr-2 h-4 w-4" />
            保存并编辑
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>模板信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">模板名称</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="例如：请假申请"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="例如：用于员工请假的标准流程"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">源模板信息</p>
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm">
                  <span className="font-medium">分类:</span> {template.category}
                </p>
                <p className="text-sm">
                  <span className="font-medium">字段数量:</span> {template.fields.length}
                </p>
                <p className="text-sm">
                  <span className="font-medium">审批流程:</span> {template.approvers.join(" → ")}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">保存后，您可以编辑模板的所有详细信息。</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
