"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, UserPlus, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import type { Employee } from "../types"

interface EmployeesTabProps {
  employees: Employee[]
  isLoading: boolean
  setNewEmployee: (emp: any) => void
  setIsEditing: (editing: boolean) => void
  setEditingId: (id: string | null) => void
  setShowEmployeeDialog: (show: boolean) => void
  editEmployee: (id: string) => void
  confirmDelete: (id: string, type: "employee" | "department" | "position") => void
  toggleEmployeeStatus: (id: string) => void
}

export function EmployeesTab({
  employees,
  isLoading,
  setNewEmployee,
  setIsEditing,
  setEditingId,
  setShowEmployeeDialog,
  editEmployee,
  confirmDelete,
  toggleEmployeeStatus,
}: EmployeesTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>员工管理</CardTitle>
        <Button
          onClick={() => {
            setNewEmployee({ name: "", role: "", department: "", email: "", phone: "", joinDate: "" })
            setIsEditing(false)
            setEditingId(null)
            setShowEmployeeDialog(true)
          }}
          className="btn-3d"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          添加员工
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>部门</TableHead>
                  <TableHead>电子邮箱</TableHead>
                  <TableHead>电话</TableHead>
                  <TableHead>入职日期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.joinDate}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          employee.status === "active"
                            ? "bg-green-100 text-green-800"
                            : employee.status === "inactive"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {employee.status === "active" ? "活跃" : employee.status === "inactive" ? "非活跃" : "休假中"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => editEmployee(employee.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDelete(employee.id, "employee")}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleEmployeeStatus(employee.id)}
                          title={employee.status === "active" ? "标记为非活跃" : "标记为活跃"}
                        >
                          {employee.status === "active" ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
