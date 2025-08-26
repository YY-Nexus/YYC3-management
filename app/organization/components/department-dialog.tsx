"use client"

import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import type { Department, Employee, NewDepartment } from "../types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const departmentSchema = z.object({
  name: z.string().min(2, { message: "部门名称至少需要2个字符" }),
  parentId: z.string().nullable(),
  managerId: z.string().nullable(),
  description: z.string().min(5, { message: "描述至少需要5个字符" }),
  status: z.enum(["active", "inactive"]),
})

interface DepartmentDialogProps {
  showDepartmentDialog: boolean
  setShowDepartmentDialog: (show: boolean) => void
  isEditing: boolean
  error: string | null
  newDepartment: NewDepartment
  setNewDepartment: (department: NewDepartment) => void
  addDepartment: () => void
  isLoading: boolean
  departments: Department[]
  employees: Employee[]
}

export function DepartmentDialog({
  showDepartmentDialog,
  setShowDepartmentDialog,
  isEditing,
  error,
  newDepartment,
  setNewDepartment,
  addDepartment,
  isLoading,
  departments,
  employees,
}: DepartmentDialogProps) {
  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: newDepartment.name,
      parentId: newDepartment.parentId,
      managerId: newDepartment.managerId,
      description: newDepartment.description,
      status: newDepartment.status,
    },
  })

  const onSubmit = (values: z.infer<typeof departmentSchema>) => {
    setNewDepartment(values)
    addDepartment()
  }

  return (
    <Dialog open={showDepartmentDialog} onOpenChange={setShowDepartmentDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "编辑部门" : "添加新部门"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "修改部门信息，完成后点击保存。" : "填写新部门的详细信息，完成后点击添加。"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>上级部门</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择上级部门" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">无上级部门</SelectItem>
                        {departments
                          .filter((dept) => !isEditing || (isEditing && dept.id !== newDepartment.parentId))
                          .map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
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
                name="managerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>部门主管</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择部门主管" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">暂不指定</SelectItem>
                        {employees
                          .filter((emp) => emp.status === "active")
                          .map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>部门描述</FormLabel>
                  <FormControl>
                    <Textarea placeholder="请输入部门描述" className="resize-none" {...field} />
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
                  <FormLabel>状态</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">启用</SelectItem>
                      <SelectItem value="inactive">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDepartmentDialog(false)}
                disabled={isLoading}
              >
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    处理中...
                  </>
                ) : isEditing ? (
                  "保存"
                ) : (
                  "添加"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
