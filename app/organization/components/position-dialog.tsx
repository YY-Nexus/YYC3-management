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
import { Loader2, Plus, X } from "lucide-react"
import type { Department, NewPosition } from "../types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Badge } from "@/components/ui/badge"

const positionSchema = z.object({
  name: z.string().min(2, { message: "职位名称至少需要2个字符" }),
  departmentId: z.string().min(1, { message: "请选择部门" }),
  salaryRange: z.string().min(1, { message: "请输入薪资范围" }),
  status: z.enum(["active", "inactive"]),
})

interface PositionDialogProps {
  showPositionDialog: boolean
  setShowPositionDialog: (show: boolean) => void
  isEditing: boolean
  error: string | null
  newPosition: NewPosition
  setNewPosition: (position: NewPosition) => void
  tempResponsibilities: string[]
  tempRequirements: string[]
  newResponsibility: string
  setNewResponsibility: (value: string) => void
  newRequirement: string
  setNewRequirement: (value: string) => void
  addResponsibility: () => void
  removeResponsibility: (index: number) => void
  addRequirement: () => void
  removeRequirement: (index: number) => void
  addPosition: () => void
  isLoading: boolean
  departments: Department[]
}

export function PositionDialog({
  showPositionDialog,
  setShowPositionDialog,
  isEditing,
  error,
  newPosition,
  setNewPosition,
  tempResponsibilities,
  tempRequirements,
  newResponsibility,
  setNewResponsibility,
  newRequirement,
  setNewRequirement,
  addResponsibility,
  removeResponsibility,
  addRequirement,
  removeRequirement,
  addPosition,
  isLoading,
  departments,
}: PositionDialogProps) {
  const form = useForm<z.infer<typeof positionSchema>>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      name: newPosition.name,
      departmentId: newPosition.departmentId,
      salaryRange: newPosition.salaryRange,
      status: newPosition.status,
    },
  })

  const onSubmit = (values: z.infer<typeof positionSchema>) => {
    const updatedPosition = {
      ...values,
      responsibilities: tempResponsibilities,
      requirements: tempRequirements,
    }
    setNewPosition(updatedPosition)
    addPosition()
  }

  return (
    <Dialog open={showPositionDialog} onOpenChange={setShowPositionDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "编辑职位" : "添加新职位"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "修改职位信息，完成后点击保存。" : "填写新职位的详细信息，完成后点击添加。"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>所属部门</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择部门" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
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
                name="salaryRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>薪资范围</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：8000-12000元/月" {...field} />
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

            <div>
              <FormLabel>主要职责</FormLabel>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <Input
                  placeholder="添加职责"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                />
                <Button type="button" size="icon" onClick={addResponsibility} disabled={!newResponsibility.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tempResponsibilities.map((resp, index) => (
                  <Badge key={index} variant="secondary" className="py-1">
                    {resp}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => removeResponsibility(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <FormLabel>任职要求</FormLabel>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <Input
                  placeholder="添加要求"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                />
                <Button type="button" size="icon" onClick={addRequirement} disabled={!newRequirement.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tempRequirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="py-1">
                    {req}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowPositionDialog(false)} disabled={isLoading}>
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
