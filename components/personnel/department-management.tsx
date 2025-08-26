"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Plus, Users, FileText } from "lucide-react"
import { departmentData } from "@/data/department-data"
import { DepartmentFormDialog } from "@/components/personnel/department-form-dialog"
import { ConfirmDeleteDialog } from "@/components/personnel/confirm-delete-dialog"
import { useRouter } from "next/navigation"

export function DepartmentManagement() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)

  const filteredDepartments = departmentData.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 处理添加部门
  const handleAddDepartment = (values: any) => {
    console.log("添加部门:", values)
    // 实际应用中这里会调用API添加部门
    // 然后刷新部门列表

    setIsAddDialogOpen(false)
  }

  // 处理编辑部门
  const handleEditDepartment = (values: any) => {
    console.log("编辑部门:", values)
    // 实际应用中这里会调用API更新部门
    // 然后刷新部门列表

    setIsEditDialogOpen(false)
  }

  // 处理删除部门
  const handleDeleteDepartment = () => {
    console.log("删除部门:", selectedDepartment?.id)
    // 实际应用中这里会调用API删除部门
    // 然后刷新部门列表

    setIsDeleteDialogOpen(false)
  }

  // 打开编辑对话框
  const openEditDialog = (department: any) => {
    setSelectedDepartment(department)
    setIsEditDialogOpen(true)
  }

  // 打开删除对话框
  const openDeleteDialog = (department: any) => {
    setSelectedDepartment(department)
    setIsDeleteDialogOpen(true)
  }

  // 查看部门员工
  const viewDepartmentEmployees = (departmentId: string) => {
    router.push(`/personnel?tab=employees&department=${departmentId}`)
  }

  // 查看部门详情
  const viewDepartmentDetails = (departmentId: string) => {
    // 实际应用中这里会跳转到部门详情页面
    console.log("查看部门详情:", departmentId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="搜索部门..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          className="bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          新增部门
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>部门名称</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>员工数量</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDepartments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>{department.manager}</TableCell>
                <TableCell>{department.employeeCount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    正常
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => viewDepartmentEmployees(department.id)}>
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => viewDepartmentDetails(department.id)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(department)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => openDeleteDialog(department)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 添加部门对话框 */}
      <DepartmentFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddDepartment}
        title="添加部门"
      />

      {/* 编辑部门对话框 */}
      {selectedDepartment && (
        <DepartmentFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleEditDepartment}
          initialData={selectedDepartment}
          title="编辑部门"
        />
      )}

      {/* 确认删除对话框 */}
      {selectedDepartment && (
        <ConfirmDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteDepartment}
          title="确认删除部门"
          description={`确定要删除部门 "${selectedDepartment.name}" 吗？此操作不可逆，删除后数据将无法恢复。`}
        />
      )}
    </div>
  )
}
