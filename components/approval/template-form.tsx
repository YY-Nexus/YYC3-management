"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Paperclip, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ApprovalTemplate, ApprovalTemplateField } from "@/data/approval-templates"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface TemplateFormProps {
  template: ApprovalTemplate
  onSubmit: (formData: Record<string, any>) => void
  onCancel: () => void
}

export function TemplateForm({ template, onSubmit, onCancel }: TemplateFormProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [files, setFiles] = useState<Record<string, File[]>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 初始化表单值
  useEffect(() => {
    const initialValues: Record<string, any> = {}
    template.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue
      }
    })
    setFormValues(initialValues)
  }, [template])

  // 处理表单值变化
  const handleValueChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))

    // 清除错误
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  // 处理文件上传
  const handleFileChange = (fieldId: string, fileList: FileList | null) => {
    if (!fileList) return

    const newFiles = Array.from(fileList)
    setFiles((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), ...newFiles],
    }))

    // 清除错误
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  // 删除文件
  const handleRemoveFile = (fieldId: string, index: number) => {
    setFiles((prev) => {
      const newFiles = { ...prev }
      newFiles[fieldId] = newFiles[fieldId].filter((_, i) => i !== index)
      return newFiles
    })
  }

  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    template.fields.forEach((field) => {
      if (field.required) {
        if (field.type === "file") {
          if (!files[field.id] || files[field.id].length === 0) {
            newErrors[field.id] = "请上传文件"
          }
        } else if (formValues[field.id] === undefined || formValues[field.id] === "" || formValues[field.id] === null) {
          newErrors[field.id] = `请填写${field.label}`
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 提交表单
  const handleSubmit = () => {
    if (validateForm()) {
      // 合并表单值和文件
      const formData = {
        ...formValues,
        _files: files,
        _template: template.id,
        _approvers: template.approvers,
      }
      onSubmit(formData)
    }
  }

  // 渲染表单字段
  const renderField = (field: ApprovalTemplateField) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              placeholder={field.placeholder || `请输入${field.label}`}
              value={formValues[field.id] || ""}
              onChange={(e) => handleValueChange(field.id, e.target.value)}
              className={errors[field.id] ? "border-red-500" : ""}
            />
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder || `请输入${field.label}`}
              value={formValues[field.id] || ""}
              onChange={(e) => handleValueChange(field.id, e.target.value)}
              className={errors[field.id] ? "border-red-500" : ""}
              rows={4}
            />
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder || `请输入${field.label}`}
              value={formValues[field.id] || ""}
              onChange={(e) => handleValueChange(field.id, e.target.value ? Number(e.target.value) : "")}
              className={errors[field.id] ? "border-red-500" : ""}
            />
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={formValues[field.id] || ""} onValueChange={(value) => handleValueChange(field.id, value)}>
              <SelectTrigger id={field.id} className={errors[field.id] ? "border-red-500" : ""}>
                <SelectValue placeholder={`请选择${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={field.id}
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formValues[field.id] && "text-muted-foreground",
                    errors[field.id] && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formValues[field.id] ? format(formValues[field.id], "yyyy年MM月dd日") : `请选择${field.label}`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formValues[field.id]}
                  onSelect={(date) => handleValueChange(field.id, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "checkbox":
        return (
          <div key={field.id} className="flex items-start space-x-2 py-2">
            <Checkbox
              id={field.id}
              checked={!!formValues[field.id]}
              onCheckedChange={(checked) => handleValueChange(field.id, checked)}
            />
            <div className="space-y-1">
              <Label htmlFor={field.id} className="font-normal">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
              {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
            </div>
          </div>
        )
      case "file":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id={field.id}
                type="file"
                className={cn("flex-1", errors[field.id] && "border-red-500")}
                onChange={(e) => handleFileChange(field.id, e.target.files)}
                multiple
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(field.id)?.click()}
              >
                <Paperclip className="h-4 w-4 mr-1" />
                浏览
              </Button>
            </div>
            {files[field.id] && files[field.id].length > 0 && (
              <div className="mt-2 space-y-2">
                {files[field.id].map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-muted/30">
                    <div className="flex items-center gap-2 text-sm">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFile(field.id, index)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">删除</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{template.name}</h2>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {template.fields.map((field) => (
              <div key={field.id} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                {renderField(field)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSubmit}>提交审批</Button>
      </div>
    </div>
  )
}
