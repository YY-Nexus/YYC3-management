"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Plus, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { positionData } from "@/data/position-data"
import { departmentData } from "@/data/department-data"
import { PositionFormDialog } from "@/components/personnel/position-form-dialog"
import { ConfirmDeleteDialog } from "@/components/personnel/confirm-delete-dialog"

export function PositionManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<any>(null)

  const filteredPositions = positionData.filter(
    (position) =>
      position.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (departmentFilter === "all" || position.departmentId === departmentFilter),
  )

  // 处理添加职位
  const handleAddPosition = (values: any) => {
    console.log("添加职位:", values)
    // 实际应用中这里会调用API添加职位
    // 然后刷新职位列表

    setIsAddDialogOpen(false)
  }

  // 处理编辑职位
  const handleEditPosition = (values: any) => {
    console.log("编辑职位:", values)
    // 实际应用中这里会调用API更新职位
    // 然后刷新职位列表

    setIsEditDialogOpen(false)
  }

  // 处理删除职位
  const handleDeletePosition = () => {
    console.log("删除职位:", selectedPosition?.id)
    // 实际应用中这里会调用API删除职位
    // 然后刷新职位列表

    setIsDeleteDialogOpen(false)
  }

  // 打开编辑对话框
  const openEditDialog = (position: any) => {
    setSelectedPosition(position)
    setIsEditDialogOpen(true)
  }

  // 打开删除对话框
  const openDeleteDialog = (position: any) => {
    setSelectedPosition(position)
    setIsDeleteDialogOpen(true)
  }

  // 查看职位详情
  const viewPositionDetails = (positionId: string) => {
    // 实际应用中这里会跳转到职位详情页面
    console.log("查看职位详情:", positionId)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="搜索职位..."
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
        </div>
        <Button
          className="bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          新增职位
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>职位名称</TableHead>
              <TableHead>所属部门</TableHead>
              <TableHead>薪资范围</TableHead>
              <TableHead>人数</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPositions.map((position) => {
              const department = departmentData.find((dept) => dept.id === position.departmentId)
              return (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">{position.name}</TableCell>
                  <TableCell>{department ? department.name : "未知部门"}</TableCell>
                  <TableCell>{position.salaryRange}</TableCell>
                  <TableCell>{position.count}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        position.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {position.status === "active" ? "招聘中" : "已关闭"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => viewPositionDetails(position.id)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(position)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => openDeleteDialog(position)}
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

      {/* 添加职位对话框 */}
      <PositionFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddPosition}
        title="添加职位"
      />

      {/* 编辑职位对话框 */}
      {selectedPosition && (
        <PositionFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleEditPosition}
          initialData={selectedPosition}
          title="编辑职位"
        />
      )}

      {/* 确认删除对话框 */}
      {selectedPosition && (
        <ConfirmDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeletePosition}
          title="确认删除职位"
          description={`确定要删除职位 "${selectedPosition.name}" 吗？此操作不可逆，删除后数据将无法恢复。`}
        />
      )}
    </div>
  )
}
