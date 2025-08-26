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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { departmentData } from "@/data/department-data"
import { positionData } from "@/data/position-data"

// 定义表单验证模式
const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "姓名至少需要2个字符" }),
  departmentId: z.string({ required_error: "请选择所属部门" }),
  position: z.string().min(2, { message: "请选择或输入职位" }),
  email: z.string().email({ message: "请输入有效的电子邮箱" }),
  phone: z.string().min(11, { message: "请输入有效的手机号码" }),
  status: z.enum(["active", "inactive", "probation"]),
  hireDate: z.string().min(1, { message: "请选择入职日期" }),
  salary: z.coerce.number().min(1, { message: "薪资必须大于0" }),
  address: z.string().min(5, { message: "请输入详细地址" }),
  education: z.string().min(1, { message: "请选择学历" }),
  major: z.string().optional(),
  emergencyContact: z.string().min(5, { message: "请输入紧急联系人信息" }),
})

type EmployeeFormValues = z.infer<typeof employeeFormSchema>

interface EmployeeFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: EmployeeFormValues) => void
  initialData?: Partial<EmployeeFormValues> & { id?: string }
  title?: string
}

export function EmployeeFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  title = "添加员工",
}: EmployeeFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(initialData.departmentId || "")

  // 初始化表单
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: initialData.name || "",
      departmentId: initialData.departmentId || "",
      position: initialData.position || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      status: initialData.status || "active",
      hireDate: initialData.hireDate || new Date().toISOString().split("T")[0],
      salary: initialData.salary || 0,
      address: initialData.address || "",
      education: initialData.education || "",
      major: initialData.major || "",
      emergencyContact: initialData.emergencyContact || "",
    },
  })

  // 处理表单提交
  const handleSubmit = async (values: EmployeeFormValues) => {
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

  // 根据所选部门筛选职位
  const departmentPositions = positionData.filter((position) => position.departmentId === selectedDepartment)

  // 监听部门变化
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
    form.setValue("departmentId", value)
    // 清空职位选择
    form.setValue("position", "")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{initialData.id ? "编辑现有员工信息" : "添加新员工到系统中"}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="work">工作信息</TabsTrigger>
                <TabsTrigger value="personal">个人信息</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>姓名</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入员工姓名" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>电子邮箱</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入电子邮箱" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>手机号码</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入手机号码" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>员工状态</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择员工状态" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">在职</SelectItem>
                            <SelectItem value="probation">试用期</SelectItem>
                            <SelectItem value="inactive">离职</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="work" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>所属部门</FormLabel>
                        <Select value={field.value} onValueChange={handleDepartmentChange}>
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
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>职位</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择职位" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departmentPositions.length > 0 ? (
                              departmentPositions.map((position) => (
                                <SelectItem key={position.id} value={position.name}>
                                  {position.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="未指定">请先选择部门</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hireDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>入职日期</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>薪资</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} placeholder="请输入薪资" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>住址</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入详细地址" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>学历</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择学历" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="初中">初中</SelectItem>
                            <SelectItem value="高中">高中</SelectItem>
                            <SelectItem value="中专">中专</SelectItem>
                            <SelectItem value="大专">大专</SelectItem>
                            <SelectItem value="本科">本科</SelectItem>
                            <SelectItem value="硕士">硕士</SelectItem>
                            <SelectItem value="博士">博士</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="major"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>专业</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入专业" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>紧急联系人</FormLabel>
                        <FormControl>
                          <Input placeholder="姓名 电话" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-br from-blue-500 to-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "提交中..." : initialData.id ? "更新员工信息" : "添加员工"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
