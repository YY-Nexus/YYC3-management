"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Plus, Users, Briefcase, Building } from "lucide-react"
import { Input } from "@/components/ui/input"
import { OrganizationStructure } from "@/components/personnel/organization-structure"
import { DepartmentManagement } from "@/components/personnel/department-management"
import { PositionManagement } from "@/components/personnel/position-management"
import { EmployeeManagement } from "@/components/personnel/employee-management"

export default function PersonnelPage() {
  const [activeTab, setActiveTab] = useState("organization")

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">人员管理</h1>
          <p className="text-gray-600 mt-1">管理公司组织架构、部门、职位和员工信息</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="搜索..." className="pl-8 w-[200px]" />
          </div>
          <Button className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            新增员工
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>组织架构</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>部门管理</span>
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>职位管理</span>
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>员工管理</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>组织架构图</CardTitle>
            </CardHeader>
            <CardContent>
              <OrganizationStructure />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>部门管理</CardTitle>
              <Button className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                新增部门
              </Button>
            </CardHeader>
            <CardContent>
              <DepartmentManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>职位管理</CardTitle>
              <Button className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                新增职位
              </Button>
            </CardHeader>
            <CardContent>
              <PositionManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>员工管理</CardTitle>
              <Button className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                新增员工
              </Button>
            </CardHeader>
            <CardContent>
              <EmployeeManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
