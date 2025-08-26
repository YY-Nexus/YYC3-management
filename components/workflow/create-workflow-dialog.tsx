"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import type { WorkflowTemplate } from "@/lib/types/workflow-types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface CreateWorkflowDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export function CreateWorkflowDialog({ isOpen, onClose, onSubmit }: CreateWorkflowDialogProps) {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [time, setTime] = useState("08:00")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 获取模板列表
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch("/api/workflow/templates")
        const data = await response.json()
        setTemplates(data.templates || [])
      } catch (error) {
        console.error("Error fetching workflow templates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchTemplates()
    }
  }, [isOpen])

  // 重置表单
  const resetForm = () => {
    setSelectedTemplate("")
    setName("")
    setDescription("")
    setDate(new Date())
    setTime("08:00")
  }

  // 处理关闭
  const handleClose = () => {
    resetForm()
    onClose()
  }

  // 处理提交
  const handleSubmit = () => {
    if (!selectedTemplate || !name || !date || !time) {
      return
    }

    setIsSubmitting(true)

    // 合并日期和时间
    const [hours, minutes] = time.split(":").map(Number)
    const startTime = new Date(date)
    startTime.setHours(hours, minutes, 0, 0)

    onSubmit({
      templateId: selectedTemplate,
      name,
      description,
      startTime: startTime.toISOString(),
    })

    setIsSubmitting(false)
  }

  // 当选择模板时，自动填充名称和描述
  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate)
      if (template) {
        const today = new Date().toLocaleDateString()
        setName(`${today} ${template.name}`)
        setDescription(template.description)
      }
    }
  }, [selectedTemplate, templates])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>创建新工作流</DialogTitle>
          <DialogDescription>创建一个新的工作流实例，安排任务和提醒。</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template">选择模板</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate} disabled={isLoading}>
              <SelectTrigger id="template">
                <SelectValue placeholder="选择工作流模板" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">工作流名称</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>开始日期</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "yyyy-MM-dd") : <span>选择日期</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">开始时间</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedTemplate || !name || isSubmitting}>
            创建工作流
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
