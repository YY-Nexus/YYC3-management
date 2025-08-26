"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Plus, FileText, Mail, Phone } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { employeeData } from "@/data/employee-data"
import { departmentData } from "@/data/department-data"
import { EmployeeFormDialog } from "@/components/personnel/employee-form-dialog"
import { ConfirmDeleteDialog } from "@/components/personnel/confirm-delete-dialog"

export function EmployeeManagement() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)

  // 从URL参数中获取部门过滤器
  useEffect(() => {
    const departmentParam = searchParams.get("department")
    if (departmentParam) {
      setDepartmentFilter(departmentParam)
    }
  }, [searchParams])

  const filteredEmployees = employeeData.filter(
    (employee) =>
      (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (departmentFilter === "all" || employee.departmentId === departmentFilter) &&
      (statusFilter === "all" || employee.status === statusFilter),
  )

  // 处理添加员工
  const handleAddEmployee = (values: any) => {
    console.log("添加员工:", values)
    // 实际应用中这里会调用API添加员工
    // 然后刷新员工列表

    setIsAddDialogOpen(false)
  }

  // 处理编辑员工
  const handleEditEmployee = (values: any) => {
    console.log("编辑员工:", values)
    // 实际应用中这里会调用API更新员工
    // 然后刷新员工列表

    setIsEditDialogOpen(false)
  }

  // 处理删除员工
  const handleDeleteEmployee = () => {
    console.log("删除员工:", selectedEmployee?.id)
    // 实际应用中这里会调用API删除员工
    // 然后刷新员工列表

    setIsDeleteDialogOpen(false)
  }

  // 打开编辑对话框
  const openEditDialog = (employee: any) => {
    setSelectedEmployee(employee)
    setIsEditDialogOpen(true)
  }

  // 打开删除对话框
  const openDeleteDialog = (employee: any) => {
    setSelectedEmployee(employee)
    setIsDeleteDialogOpen(true)
  }

  // 查看员工详情
  const viewEmployeeDetails = (employeeId: string) => {
    router.push(`/personnel/employee/${employeeId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="搜索员工..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              {departmentData.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">在职</SelectItem>
              <SelectItem value="inactive">离职</SelectItem>
              <SelectItem value="probation">试用期</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          新增员工
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>员工</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>职位</TableHead>
              <TableHead>联系方式</TableHead>
              <TableHead>入职日期</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => {
              const department = departmentData.find((dept) => dept.id === employee.departmentId)
              return (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{department ? department.name : "未知部门"}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{employee.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.hireDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        employee.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : employee.status === "probation"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {employee.status === "active" ? "在职" : employee.status === "probation" ? "试用期" : "离职"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => viewEmployeeDetails(employee.id)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(employee)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => openDeleteDialog(employee)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* 添加员工对话框 */}
      <EmployeeFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddEmployee}
        title="添加员工"
      />

      {/* 编辑员工对话框 */}
      {selectedEmployee && (
        <EmployeeFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleEditEmployee}
          initialData={selectedEmployee}
          title="编辑员工"
        />
      )}

      {/* 确认删除对话框 */}
      {selectedEmployee && (
        <ConfirmDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteEmployee}
          title="确认删除员工"
          description={`确定要删除员工 "${selectedEmployee.name}" 吗？此操作不可逆，删除后数据将无法恢复。`}
        />
      )}
    </div>
  )
}
