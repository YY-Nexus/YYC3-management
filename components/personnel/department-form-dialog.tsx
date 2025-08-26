"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { employeeData } from "@/data/employee-data"

// 定义表单验证模式
const departmentFormSchema = z.object({
  name: z.string().min(2, { message: "部门名称至少需要2个字符" }),
  description: z.string().min(5, { message: "部门描述至少需要5个字符" }),
  managerId: z.string().optional(),
  parentId: z.string().optional(),
})

type DepartmentFormValues = z.infer<typeof departmentFormSchema>

interface DepartmentFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: DepartmentFormValues) => void
  initialData?: {
    id?: string
    name?: string
    description?: string
    managerId?: string
    parentId?: string
  }
  title?: string
}

export function DepartmentFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  title = "添加部门",
}: DepartmentFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 初始化表单
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      managerId: initialData.managerId || "",
      parentId: initialData.parentId || "",
    },
  })

  // 处理表单提交
  const handleSubmit = async (values: DepartmentFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
      form.reset()
      onClose()
    } catch (error) {
      console.error("提交表单时出错:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 获取管理层员工列表（用于选择部门负责人）
  const managers = employeeData.filter(
    (employee) =>
      employee.position.includes("经理") || employee.position.includes("总监") || employee.position.includes("主管"),
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{initialData.id ? "编辑现有部门信息" : "添加新部门到组织架构中"}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>部门名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入部门名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>部门描述</FormLabel>
                  <FormControl>
                    <Textarea placeholder="请输入部门职责描述" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="managerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>部门负责人</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择部门负责人" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">暂不指定</SelectItem>
                      {managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name} ({manager.position})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-br from-blue-500 to-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "提交中..." : initialData.id ? "更新部门" : "添加部门"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
