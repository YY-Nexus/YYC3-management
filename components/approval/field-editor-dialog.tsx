"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { ApprovalTemplateField } from "@/data/approval-templates"

interface FieldEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  field: ApprovalTemplateField | null
  onSave: (field: ApprovalTemplateField) => void
}

export function FieldEditorDialog({ open, onOpenChange, field, onSave }: FieldEditorDialogProps) {
  const [fieldData, setFieldData] = useState<ApprovalTemplateField>({
    id: "",
    label: "",
    type: "text",
    required: false,
  })
  const [newOption, setNewOption] = useState("")

  // 初始化字段数据
  useEffect(() => {
    if (field) {
      setFieldData({ ...field })
    } else {
      setFieldData({
        id: uuidv4(),
        label: "",
        type: "text",
        required: false,
      })
    }
  }, [field, open])

  // 处理字段属性变更
  const handleFieldChange = (property: keyof ApprovalTemplateField, value: any) => {
    setFieldData((prev) => ({
      ...prev,
      [property]: value,
    }))
  }

  // 添加选项
  const handleAddOption = () => {
    if (!newOption.trim()) return

    const options = fieldData.options || []
    setFieldData((prev) => ({
      ...prev,
      options: [...options, newOption.trim()],
    }))
    setNewOption("")
  }

  // 删除选项
  const handleRemoveOption = (index: number) => {
    if (!fieldData.options) return

    const newOptions = [...fieldData.options]
    newOptions.splice(index, 1)

    setFieldData((prev) => ({
      ...prev,
      options: newOptions,
    }))
  }

  // 保存字段
  const handleSave = () => {
    // 验证必填项
    if (!fieldData.label.trim()) {
      alert("请填写字段标签")
      return
    }

    // 如果是select类型，必须有选项
    if (fieldData.type === "select" && (!fieldData.options || fieldData.options.length === 0)) {
      alert("下拉选择类型必须添加至少一个选项")
      return
    }

    onSave(fieldData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{field ? "编辑字段" : "添加字段"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">字段标签</Label>
                <Input
                  id="label"
                  value={fieldData.label}
                  onChange={(e) => handleFieldChange("label", e.target.value)}
                  placeholder="例如：请假类型"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id">字段ID</Label>
                <Input
                  id="id"
                  value={fieldData.id}
                  onChange={(e) => handleFieldChange("id", e.target.value)}
                  placeholder="例如：leave_type"
                />
                <p className="text-xs text-muted-foreground">字段的唯一标识符，用于表单提交</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">字段类型</Label>
                <Select value={fieldData.type} onValueChange={(value) => handleFieldChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="选择字段类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">单行文本</SelectItem>
                    <SelectItem value="textarea">多行文本</SelectItem>
                    <SelectItem value="number">数字</SelectItem>
                    <SelectItem value="select">下拉选择</SelectItem>
                    <SelectItem value="date">日期</SelectItem>
                    <SelectItem value="checkbox">复选框</SelectItem>
                    <SelectItem value="file">文件上传</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 h-10 mt-8">
                <Switch
                  id="required"
                  checked={fieldData.required || false}
                  onCheckedChange={(checked) => handleFieldChange("required", checked)}
                />
                <Label htmlFor="required">必填字段</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder">占位符文本</Label>
              <Input
                id="placeholder"
                value={fieldData.placeholder || ""}
                onChange={(e) => handleFieldChange("placeholder", e.target.value)}
                placeholder="例如：请选择请假类型..."
              />
              <p className="text-xs text-muted-foreground">显示在空白字段中的提示文本</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">字段描述</Label>
              <Textarea
                id="description"
                value={fieldData.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="例如：请选择您的请假类型，不同类型有不同的审批流程"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">显示在字段下方的帮助文本</p>
            </div>

            {fieldData.type === "select" && (
              <div className="space-y-2">
                <Label>选项列表</Label>
                <div className="flex gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="添加新选项..."
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddOption}>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">添加</span>
                  </Button>
                </div>

                <div className="space-y-2 mt-2">
                  {fieldData.options && fieldData.options.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {fieldData.options.map((option, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {option}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => handleRemoveOption(index)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">删除</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">暂无选项，请添加至少一个选项</p>
                  )}
                </div>
              </div>
            )}

            {fieldData.type === "checkbox" && (
              <div className="space-y-2">
                <Label htmlFor="defaultValue">默认值</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="defaultValue"
                    checked={!!fieldData.defaultValue}
                    onCheckedChange={(checked) => handleFieldChange("defaultValue", checked)}
                  />
                  <Label htmlFor="defaultValue">默认选中</Label>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>保存字段</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
