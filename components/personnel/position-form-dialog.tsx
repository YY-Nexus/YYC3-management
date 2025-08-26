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
import { departmentData } from "@/data/department-data"

// 定义表单验证模式
const positionFormSchema = z.object({
  name: z.string().min(2, { message: "职位名称至少需要2个字符" }),
  departmentId: z.string({ required_error: "请选择所属部门" }),
  salaryRange: z.string().min(3, { message: "请输入薪资范围" }),
  count: z.coerce.number().min(1, { message: "人数至少为1" }),
  status: z.enum(["active", "inactive"]),
  responsibilities: z.string().min(5, { message: "职责描述至少需要5个字符" }),
  requirements: z.string().min(5, { message: "任职要求至少需要5个字符" }),
})

type PositionFormValues = z.infer<typeof positionFormSchema>

interface PositionFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: PositionFormValues) => void
  initialData?: {
    id?: string
    name?: string
    departmentId?: string
    salaryRange?: string
    count?: number
    status?: "active" | "inactive"
    responsibilities?: string[]
    requirements?: string[]
  }
  title?: string
}

export function PositionFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  title = "添加职位",
}: PositionFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 初始化表单
  const form = useForm<PositionFormValues>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      name: initialData.name || "",
      departmentId: initialData.departmentId || "",
      salaryRange: initialData.salaryRange || "",
      count: initialData.count || 1,
      status: initialData.status || "active",
      responsibilities: initialData.responsibilities ? initialData.responsibilities.join("\n") : "",
      requirements: initialData.requirements ? initialData.requirements.join("\n") : "",
    },
  })

  // 处理表单提交
  const handleSubmit = async (values: PositionFormValues) => {
    setIsSubmitting(true)
    try {
      // 转换职责和要求为数组
      const formattedValues = {
        ...values,
        responsibilities: values.responsibilities.split("\n").filter((item) => item.trim() !== ""),
        requirements: values.requirements.split("\n").filter((item) => item.trim() !== ""),
      }
      await onSubmit(formattedValues as any)
      form.reset()
      onClose()
    } catch (error) {
      console.error("提交表单时出错:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{initialData.id ? "编辑现有职位信息" : "添加新职位到组织架构中"}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>职位名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入职位名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>所属部门</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择所属部门" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departmentData.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salaryRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>薪资范围</FormLabel>
                    <FormControl>
                      <Input placeholder="例如: 5000-8000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>职位人数</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>职位状态</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择职位状态" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">招聘中</SelectItem>
                      <SelectItem value="inactive">已关闭</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>职责描述</FormLabel>
                  <FormControl>
                    <Textarea placeholder="请输入职责描述，每行一条" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>任职要求</FormLabel>
                  <FormControl>
                    <Textarea placeholder="请输入任职要求，每行一条" rows={4} {...field} />
                  </FormControl>
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
                {isSubmitting ? "提交中..." : initialData.id ? "更新职位" : "添加职位"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
