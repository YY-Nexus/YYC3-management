"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

export default function CreateTemplatePage() {
  const router = useRouter()

  const [template, setTemplate] = useState({
    id: uuidv4(),
    name: "",
    description: "",
    category: "日常运营",
    nodes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  // 处理基本信息变更
  const handleBasicInfoChange = (field: string, value: any) => {
    setTemplate({
      ...template,
      [field]: value,
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
      const response = await fetch("/api/workflow/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      })

      if (response.ok) {
        // 保存成功后跳转到编辑页面
        router.push(`/workflow/templates/edit/${template.id}`)
      } else {
        console.error("创建模板失败")
      }
    } catch (error) {
      console.error("创建模板失败:", error)
    }
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
              <h1 className="text-2xl font-bold tracking-tight">创建模板</h1>
              <p className="text-muted-foreground">创建新的工作流模板</p>
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
                  placeholder="例如：日常运营流程"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Select value={template.category} onValueChange={(value) => handleBasicInfoChange("category", value)}>
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
                placeholder="例如：用于日常运营的标准工作流程"
                rows={3}
              />
            </div>

            <p className="text-sm text-muted-foreground pt-4">创建模板后，您可以添加节点和设置依赖关系。</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
