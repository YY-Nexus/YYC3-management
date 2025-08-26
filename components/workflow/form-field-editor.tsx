"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react"
import type { FormField } from "@/lib/types/advanced-workflow-types"
import { v4 as uuidv4 } from "uuid"

interface FormFieldEditorProps {
  fields: FormField[]
  onChange: (fields: FormField[]) => void
}

export function FormFieldEditor({ fields, onChange }: FormFieldEditorProps) {
  const [expandedField, setExpandedField] = useState<string | null>(null)

  // 添加新字段
  const addField = () => {
    const newField: FormField = {
      id: uuidv4(),
      name: `field_${Date.now()}`,
      label: "新字段",
      type: "text",
      required: false,
    }
    onChange([...fields, newField])
    setExpandedField(newField.id)
  }

  // 更新字段
  const updateField = (index: number, field: Partial<FormField>) => {
    const updatedFields = [...fields]
    updatedFields[index] = { ...updatedFields[index], ...field }
    onChange(updatedFields)
  }

  // 删除字段
  const deleteField = (index: number) => {
    const updatedFields = [...fields]
    updatedFields.splice(index, 1)
    onChange(updatedFields)
  }

  // 移动字段
  const moveField = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === fields.length - 1)) {
      return
    }

    const updatedFields = [...fields]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const temp = updatedFields[index]
    updatedFields[index] = updatedFields[newIndex]
    updatedFields[newIndex] = temp
    onChange(updatedFields)
  }

  // 切换字段展开状态
  const toggleExpand = (id: string) => {
    setExpandedField(expandedField === id ? null : id)
  }

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">暂无表单字段</p>
          <p className="text-xs text-gray-400 mt-1">点击下方按钮添加字段</p>
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <Card key={field.id} className={expandedField === field.id ? "border-blue-300" : ""}>
              <CardHeader className="p-3 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <CardTitle className="text-sm font-medium">{field.label}</CardTitle>
                    <span className="text-xs text-gray-500">({field.type})</span>
                    {field.required && <span className="text-xs text-red-500">*必填</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveField(index, "up")}
                      disabled={index === 0}
                      className="h-6 w-6"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveField(index, "down")}
                      disabled={index === fields.length - 1}
                      className="h-6 w-6"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleExpand(field.id)} className="h-6 w-6">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedField === field.id ? "rotate-180" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteField(index)}
                      className="h-6 w-6 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedField === field.id && (
                <CardContent className="p-3">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`field-label-${index}`} className="text-xs">
                          显示名称
                        </Label>
                        <Input
                          id={`field-label-${index}`}
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`field-name-${index}`} className="text-xs">
                          字段名称
                        </Label>
                        <Input
                          id={`field-name-${index}`}
                          value={field.name}
                          onChange={(e) => updateField(index, { name: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`field-type-${index}`} className="text-xs">
                          字段类型
                        </Label>
                        <Select
                          value={field.type}
                          onValueChange={(value) => updateField(index, { type: value as any })}
                        >
                          <SelectTrigger id={`field-type-${index}`} className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">文本</SelectItem>
                            <SelectItem value="number">数字</SelectItem>
                            <SelectItem value="date">日期</SelectItem>
                            <SelectItem value="select">下拉选择</SelectItem>
                            <SelectItem value="checkbox">复选框</SelectItem>
                            <SelectItem value="radio">单选按钮</SelectItem>
                            <SelectItem value="textarea">多行文本</SelectItem>
                            <SelectItem value="file">文件上传</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`field-required-${index}`} className="text-xs">
                          必填字段
                        </Label>
                        <Switch
                          id={`field-required-${index}`}
                          checked={field.required}
                          onCheckedChange={(checked) => updateField(index, { required: checked })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor={`field-placeholder-${index}`} className="text-xs">
                        占位文本
                      </Label>
                      <Input
                        id={`field-placeholder-${index}`}
                        value={field.placeholder || ""}
                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor={`field-description-${index}`} className="text-xs">
                        描述说明
                      </Label>
                      <Textarea
                        id={`field-description-${index}`}
                        value={field.description || ""}
                        onChange={(e) => updateField(index, { description: e.target.value })}
                        className="text-sm"
                        rows={2}
                      />
                    </div>

                    {(field.type === "select" || field.type === "radio") && (
                      <div className="space-y-1">
                        <Label className="text-xs">选项（每行一个，格式：标签:值）</Label>
                        <Textarea
                          value={
                            field.options ? field.options.map((opt) => `${opt.label}:${opt.value}`).join("\n") : ""
                          }
                          onChange={(e) => {
                            const options = e.target.value
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line) => {
                                const [label, value] = line.split(":")
                                return {
                                  label: label?.trim() || "",
                                  value: value?.trim() || label?.trim() || "",
                                }
                              })
                            updateField(index, { options })
                          }}
                          className="text-sm"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Button onClick={addField} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        添加表单字段
      </Button>
    </div>
  )
}
