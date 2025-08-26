"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, FileText, Calendar, BarChart2 } from "lucide-react"
import { employeeData } from "@/data/employee-data"
import { departmentData } from "@/data/department-data"
import { EmployeeFormDialog } from "@/components/personnel/employee-form-dialog"
import { ConfirmDeleteDialog } from "@/components/personnel/confirm-delete-dialog"
import { EmployeeAttendance } from "@/components/personnel/employee-attendance"
import { EmployeePerformance } from "@/components/personnel/employee-performance"
import { EmployeeFiles } from "@/components/personnel/employee-files"

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const employeeId = params.id as string

  const [employee, setEmployee] = useState<any>(null)
  const [department, setDepartment] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  useEffect(() => {
    // 获取员工信息
    const foundEmployee = employeeData.find((emp) => emp.id === employeeId)
    if (foundEmployee) {
      setEmployee(foundEmployee)

      // 获取部门信息
      const foundDepartment = departmentData.find((dept) => dept.id === foundEmployee.departmentId)
      if (foundDepartment) {
        setDepartment(foundDepartment)
      }
    }
  }, [employeeId])

  if (!employee) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">未找到员工信息</h2>
              <p className="text-gray-500 mb-4">无法找到ID为 {employeeId} 的员工</p>
              <Button onClick={() => router.push("/personnel")} className="mt-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回员工列表
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 获取员工状态显示
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "active":
        return { label: "在职", className: "bg-green-50 text-green-700 border-green-200" }
      case "probation":
        return { label: "试用期", className: "bg-yellow-50 text-yellow-700 border-yellow-200" }
      case "inactive":
        return { label: "离职", className: "bg-gray-50 text-gray-700 border-gray-200" }
      default:
        return { label: "未知", className: "bg-gray-50 text-gray-700 border-gray-200" }
    }
  }

  const statusDisplay = getStatusDisplay(employee.status)

  // 处理编辑员工
  const handleEditEmployee = (values: any) => {
    console.log("编辑员工:", values)
    // 实际应用中这里会调用API更新员工信息
    // 然后刷新页面或更新状态

    // 模拟更新成功
    setEmployee({
      ...employee,
      ...values,
    })
    setIsEditDialogOpen(false)
  }

  // 处理删除员工
  const handleDeleteEmployee = () => {
    console.log("删除员工:", employeeId)
    // 实际应用中这里会调用API删除员工
    // 然后重定向到员工列表页面

    // 模拟删除成功
    router.push("/personnel?tab=employees")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/personnel?tab=employees")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">员工档案</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            编辑信息
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            删除员工
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">{employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{employee.name}</h2>
              <p className="text-gray-500 mb-2">{employee.position}</p>
              <Badge variant="outline" className={statusDisplay.className}>
                {statusDisplay.label}
              </Badge>

              <Separator className="my-4" />

              <div className="w-full text-left space-y-3">
                <div>
                  <p className="text-sm text-gray-500">部门</p>
                  <p className="font-medium">{department?.name || "未知部门"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">工号</p>
                  <p className="font-medium">{employee.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">入职日期</p>
                  <p className="font-medium">{employee.hireDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">联系电话</p>
                  <p className="font-medium">{employee.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">电子邮箱</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>员工详细信息</CardTitle>
            <CardDescription>查看和管理员工的详细信息、考勤记录和绩效评估</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="basic" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">基本信息</span>
                </TabsTrigger>
                <TabsTrigger value="attendance" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">考勤记录</span>
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-1">
                  <BarChart2 className="h-4 w-4" />
                  <span className="hidden sm:inline">绩效评估</span>
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">档案文件</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>个人信息</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">姓名</p>
                            <p className="font-medium">{employee.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">性别</p>
                            <p className="font-medium">未设置</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">出生日期</p>
                            <p className="font-medium">未设置</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">身份证号</p>
                            <p className="font-medium">未设置</p>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-gray-500">住址</p>
                          <p className="font-medium">{employee.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">紧急联系人</p>
                          <p className="font-medium">{employee.emergencyContact}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>工作信息</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">部门</p>
                            <p className="font-medium">{department?.name || "未知部门"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">职位</p>
                            <p className="font-medium">{employee.position}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">入职日期</p>
                            <p className="font-medium">{employee.hireDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">工作状态</p>
                            <p className="font-medium">{statusDisplay.label}</p>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-gray-500">薪资</p>
                          <p className="font-medium">{employee.salary} 元/月</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>教育背景</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">最高学历</p>
                            <p className="font-medium">{employee.education}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">专业</p>
                            <p className="font-medium">{employee.major || "未设置"}</p>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-gray-500">毕业院校</p>
                          <p className="font-medium">未设置</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">毕业时间</p>
                          <p className="font-medium">未设置</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>技能与证书</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">专业技能</p>
                          <p className="font-medium">未设置</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-gray-500">证书</p>
                          <p className="font-medium">未设置</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="attendance">
                <EmployeeAttendance employeeId={employeeId} />
              </TabsContent>

              <TabsContent value="performance">
                <EmployeePerformance employeeId={employeeId} />
              </TabsContent>

              <TabsContent value="files">
                <EmployeeFiles employeeId={employeeId} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 编辑员工对话框 */}
      <EmployeeFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditEmployee}
        initialData={employee}
        title="编辑员工信息"
      />

      {/* 确认删除对话框 */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteEmployee}
        title="确认删除员工"
        description={`确定要删除员工 "${employee.name}" 吗？此操作不可逆，删除后数据将无法恢复。`}
      />
    </div>
  )
}
