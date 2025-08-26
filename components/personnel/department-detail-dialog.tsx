"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"

interface DepartmentDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  department: any
}

export function DepartmentDetailDialog({ isOpen, onClose, department }: DepartmentDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("info")

  // 根据部门名称获取颜色
  const getDepartmentColor = (name: string): string => {
    const colorMap: Record<string, string> = {
      行政部: "bg-red-100 text-red-800 border-red-300",
      财务部: "bg-yellow-100 text-yellow-800 border-yellow-300",
      营销部: "bg-green-100 text-green-800 border-green-300",
      人事部: "bg-blue-100 text-blue-800 border-blue-300",
      客服部: "bg-purple-100 text-purple-800 border-purple-300",
      安保部: "bg-orange-100 text-orange-800 border-orange-300",
      管家部: "bg-emerald-100 text-emerald-800 border-emerald-300",
      后勤部: "bg-cyan-100 text-cyan-800 border-cyan-300",
      运营部: "bg-indigo-100 text-indigo-800 border-indigo-300",
    }

    return colorMap[name] || "bg-gray-100 text-gray-800 border-gray-300"
  }

  // 模拟数据
  const employees = [
    { id: 1, name: "张三", position: "部门经理", status: "在职", hireDate: "2020-01-15" },
    { id: 2, name: "李四", position: "高级专员", status: "在职", hireDate: "2020-03-20" },
    { id: 3, name: "王五", position: "专员", status: "在职", hireDate: "2021-05-10" },
    { id: 4, name: "赵六", position: "助理", status: "在职", hireDate: "2022-02-18" },
  ]

  const positions = [
    { id: 1, name: "部门经理", count: 1, salaryRange: "10000-15000" },
    { id: 2, name: "高级专员", count: 1, salaryRange: "8000-12000" },
    { id: 3, name: "专员", count: 1, salaryRange: "6000-9000" },
    { id: 4, name: "助理", count: 1, salaryRange: "4000-6000" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {department.name.includes("部") ? (
              <Badge className={`${getDepartmentColor(department.name)} px-3 py-1 text-sm`}>{department.name}</Badge>
            ) : (
              <span>{department.name}</span>
            )}
            <span>{department.name.includes("部") ? "部门详情" : "职位详情"}</span>
          </DialogTitle>
          <DialogDescription>
            {department.name.includes("部") ? "查看部门的详细信息、职位和员工" : "查看职位的详细信息"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info">基本信息</TabsTrigger>
            <TabsTrigger value="positions">职位设置</TabsTrigger>
            <TabsTrigger value="employees">部门员工</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">名称</h4>
                    <p>{department.name}</p>
                  </div>
                  {department.position && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">职位类型</h4>
                      <p>{department.position}</p>
                    </div>
                  )}
                  {department.manager && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">负责人</h4>
                      <p>{department.manager}</p>
                    </div>
                  )}
                  {department.employeeCount !== undefined && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">员工数量</h4>
                      <p>{department.employeeCount} 人</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">描述</h4>
                  <p className="text-gray-700">{department.description}</p>
                </div>

                {department.manager && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">部门负责人</h4>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{department.manager ? department.manager.charAt(0) : "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{department.manager}</p>
                        <p className="text-sm text-gray-500">部门经理</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="positions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>职位列表</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>职位名称</TableHead>
                      <TableHead>人数</TableHead>
                      <TableHead>薪资范围</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position) => (
                      <TableRow key={position.id}>
                        <TableCell className="font-medium">{position.name}</TableCell>
                        <TableCell>{position.count}</TableCell>
                        <TableCell>{position.salaryRange}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            查看
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>员工列表</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>职位</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>入职日期</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{employee.hireDate}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            查看
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={onClose} className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
