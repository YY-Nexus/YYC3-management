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
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApprovalFormBuilderProps {
  type: string
}

export function ApprovalFormBuilder({ type }: ApprovalFormBuilderProps) {
  const [formFields, setFormFields] = useState<any[]>([])
  const [date, setDate] = useState<Date>()

  // 根据审批类型加载不同的表单字段
  useEffect(() => {
    switch (type) {
      case "请假申请":
        setFormFields([
          {
            id: "leave_type",
            label: "请假类型",
            type: "select",
            options: ["年假", "病假", "事假", "婚假", "产假", "其他"],
          },
          { id: "start_date", label: "开始日期", type: "date" },
          { id: "end_date", label: "结束日期", type: "date" },
          { id: "days", label: "请假天数", type: "number" },
          { id: "reason", label: "请假原因", type: "textarea" },
          { id: "contact", label: "紧急联系方式", type: "text" },
          { id: "handover", label: "工作交接人", type: "text" },
        ])
        break
      case "费用报销":
        setFormFields([
          {
            id: "expense_type",
            label: "费用类型",
            type: "select",
            options: ["差旅费", "办公用品", "招待费", "培训费", "其他"],
          },
          { id: "amount", label: "报销金额", type: "number" },
          { id: "expense_date", label: "费用发生日期", type: "date" },
          { id: "project", label: "所属项目", type: "text" },
          { id: "description", label: "费用说明", type: "textarea" },
          { id: "receipt", label: "是否有发票", type: "checkbox" },
          { id: "account", label: "收款账户", type: "text" },
        ])
        break
      case "采购申请":
        setFormFields([
          { id: "item_name", label: "物品名称", type: "text" },
          {
            id: "category",
            label: "物品类别",
            type: "select",
            options: ["办公用品", "电子设备", "软件", "家具", "其他"],
          },
          { id: "quantity", label: "数量", type: "number" },
          { id: "unit_price", label: "单价", type: "number" },
          { id: "total_price", label: "总价", type: "number" },
          { id: "supplier", label: "供应商", type: "text" },
          { id: "purpose", label: "用途说明", type: "textarea" },
          { id: "urgent", label: "是否紧急", type: "checkbox" },
        ])
        break
      case "合同审批":
        setFormFields([
          { id: "contract_name", label: "合同名称", type: "text" },
          {
            id: "contract_type",
            label: "合同类型",
            type: "select",
            options: ["销售合同", "采购合同", "服务合同", "劳务合同", "其他"],
          },
          { id: "party", label: "合同对方", type: "text" },
          { id: "amount", label: "合同金额", type: "number" },
          { id: "start_date", label: "开始日期", type: "date" },
          { id: "end_date", label: "结束日期", type: "date" },
          { id: "content", label: "主要内容", type: "textarea" },
          { id: "risk", label: "风险评估", type: "textarea" },
        ])
        break
      case "加班申请":
        setFormFields([
          { id: "overtime_date", label: "加班日期", type: "date" },
          { id: "start_time", label: "开始时间", type: "text" },
          { id: "end_time", label: "结束时间", type: "text" },
          { id: "hours", label: "加班小时数", type: "number" },
          { id: "reason", label: "加班原因", type: "textarea" },
          { id: "compensation", label: "补偿方式", type: "select", options: ["调休", "加班费", "其他"] },
        ])
        break
      case "培训申请":
        setFormFields([
          { id: "training_name", label: "培训名称", type: "text" },
          { id: "organizer", label: "培训机构", type: "text" },
          { id: "start_date", label: "开始日期", type: "date" },
          { id: "end_date", label: "结束日期", type: "date" },
          { id: "location", label: "培训地点", type: "text" },
          { id: "cost", label: "培训费用", type: "number" },
          { id: "purpose", label: "培训目的", type: "textarea" },
          { id: "benefit", label: "预期收益", type: "textarea" },
        ])
        break
      default:
        setFormFields([])
    }
  }, [type])

  // 渲染表单字段
  const renderField = (field: any) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <Input placeholder={`请输入${field.label}`} />
          </div>
        )
      case "textarea":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <Textarea placeholder={`请输入${field.label}`} rows={3} />
          </div>
        )
      case "number":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <Input type="number" placeholder={`请输入${field.label}`} />
          </div>
        )
      case "select":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={`请选择${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case "checkbox":
        return (
          <div key={field.id} className="flex items-center space-x-2 mb-4">
            <Checkbox id={field.id} />
            <label
              htmlFor={field.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        )
      case "date":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "yyyy年MM月dd日") : `请选择${field.label}`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {formFields.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{formFields.map((field) => renderField(field))}</div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          <p>未找到该审批类型的表单模板</p>
        </div>
      )}
    </div>
  )
}
