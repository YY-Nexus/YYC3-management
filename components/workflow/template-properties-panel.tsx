"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { AdvancedWorkflowTemplate } from "@/lib/types/advanced-workflow-types"
import { useState } from "react"

interface TemplatePropertiesProps {
  template: AdvancedWorkflowTemplate
  onUpdate: (template: Partial<AdvancedWorkflowTemplate>) => void
}

export function TemplatePropertiesPanel({ template, onUpdate }: TemplatePropertiesProps) {
  const [newVarName, setNewVarName] = useState("")
  const [newVarType, setNewVarType] = useState("string")
  const [newVarValue, setNewVarValue] = useState("")

  // 处理基本属性变更
  const handleChange = (field: string, value: any) => {
    onUpdate({ [field]: value })
  }

  // 添加变量
  const addVariable = () => {
    if (!newVarName.trim()) return

    const newVar = {
      name: newVarName.trim(),
      type: newVarType,
      defaultValue: newVarValue || undefined,
    }

    onUpdate({
      variables: [...template.variables, newVar],
    })

    setNewVarName("")
    setNewVarType("string")
    setNewVarValue("")
  }

  // 删除变量
  const deleteVariable = (index: number) => {
    const updatedVars = [...template.variables]
    updatedVars.splice(index, 1)
    onUpdate({ variables: updatedVars })
  }

  // 更新变量
  const updateVariable = (index: number, field: string, value: any) => {
    const updatedVars = [...template.variables]
    updatedVars[index] = { ...updatedVars[index], [field]: value }
    onUpdate({ variables: updatedVars })
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">基本信息</h3>

        <div className="space-y-2">
          <Label htmlFor="name">模板名称</Label>
          <Input id="name" value={template.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">模板描述</Label>
          <Textarea
            id="description"
            value={template.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">分类</Label>
          <Select value={template.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="通用">通用</SelectItem>
              <SelectItem value="日常运营">日常运营</SelectItem>
              <SelectItem value="盘点管理">盘点管理</SelectItem>
              <SelectItem value="人事管理">人事管理</SelectItem>
              <SelectItem value="财务管理">财务管理</SelectItem>
              <SelectItem value="客户管理">客户管理</SelectItem>
              <SelectItem value="其他">其他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={template.isPublished}
            onCheckedChange={(checked) => handleChange("isPublished", checked)}
          />
          <Label htmlFor="published">发布模板</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">工作流变量</h3>
        <p className="text-sm text-gray-500">变量可以在工作流执行过程中存储和传递数据，用于条件判断和动态内容。</p>

        <div className="space-y-2">
          {template.variables.length === 0 ? (
            <div className="text-center py-4 border rounded-md bg-gray-50">
              <p className="text-gray-500">暂无变量</p>
            </div>
          ) : (
            <div className="space-y-2">
              {template.variables.map((variable, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={variable.name}
                    onChange={(e) => updateVariable(index, "name", e.target.value)}
                    placeholder="变量名"
                    className="w-1/4"
                  />
                  <Select value={variable.type} onValueChange={(value) => updateVariable(index, "type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">字符串</SelectItem>
                      <SelectItem value="number">数字</SelectItem>
                      <SelectItem value="boolean">布尔值</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={variable.defaultValue || ""}
                    onChange={(e) => updateVariable(index, "defaultValue", e.target.value)}
                    placeholder="默认值"
                    className="w-1/4"
                  />
                  <Button variant="destructive" size="icon" onClick={() => deleteVariable(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="变量名"
              value={newVarName}
              onChange={(e) => setNewVarName(e.target.value)}
              className="w-1/4"
            />
            <Select value={newVarType} onValueChange={(value) => setNewVarType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">字符串</SelectItem>
                <SelectItem value="number">数字</SelectItem>
                <SelectItem value="boolean">布尔值</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="默认值"
              value={newVarValue}
              onChange={(e) => setNewVarValue(e.target.value)}
              className="w-1/4"
            />
            <Button onClick={addVariable}>
              <Plus className="h-4 w-4 mr-2" />
              添加变量
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium">条件表达式编辑器</h3>
        <p className="text-sm text-gray-500">创建和编辑条件表达式，用于工作流中的条件判断。</p>
      </div>
    </div>
  )
}
