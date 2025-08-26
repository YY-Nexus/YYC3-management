"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Permission = {
  id: string
  name: string
  description: string
}

type Position = {
  id: number
  name: string
  department: string
  level: string
  permissions: string[]
}

const departments = ["技术部", "市场部", "人事部", "财务部", "运营部", "设计部"]
const levels = ["初级", "中级", "高级", "主管", "经理", "总监"]
const allPermissions: Permission[] = [
  { id: "doc_manage", name: "文档管理", description: "查看和编辑公司文档" },
  { id: "hr_manage", name: "人员管理", description: "管理员工信息和权限" },
  { id: "approval", name: "审批权限", description: "审批各类申请" },
  { id: "finance", name: "财务权限", description: "查看和管理财务信息" },
  { id: "system_settings", name: "系统设置", description: "修改系统配置" },
  { id: "design_tools", name: "设计工具", description: "使用AI设计工具" },
  { id: "ai_maintenance", name: "AI机维", description: "使用AI机维模块" },
]

export default function PositionSettings() {
  const { toast } = useToast()
  const [positions, setPositions] = useState<Position[]>([
    { id: 1, name: "软件工程师", department: "技术部", level: "中级", permissions: ["doc_manage"] },
    { id: 2, name: "市场专员", department: "市场部", level: "初级", permissions: ["doc_manage"] },
    {
      id: 3,
      name: "人事主管",
      department: "人事部",
      level: "主管",
      permissions: ["doc_manage", "hr_manage", "approval"],
    },
    { id: 4, name: "设计师", department: "设计部", level: "中级", permissions: ["doc_manage", "design_tools"] },
  ])

  const [newPosition, setNewPosition] = useState<Omit<Position, "id">>({
    name: "",
    department: "",
    level: "",
    permissions: [],
  })

  const [editingId, setEditingId] = useState<number | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setNewPosition((prev) => ({ ...prev, [field]: value }))
  }

  const handlePermissionChange = (permissionId: string) => {
    setNewPosition((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }))
  }

  const addOrUpdatePosition = () => {
    if (!newPosition.name || !newPosition.department || !newPosition.level) {
      toast({
        title: "错误",
        description: "请填写所有必填字段",
        variant: "destructive",
      })
      return
    }

    if (editingId !== null) {
      setPositions(
        positions.map((position) => (position.id === editingId ? { ...newPosition, id: editingId } : position)),
      )
      setEditingId(null)
      toast({
        title: "成功",
        description: "岗位已更新",
      })
    } else {
      setPositions([...positions, { ...newPosition, id: positions.length + 1 }])
      toast({
        title: "成功",
        description: "新岗位已添加",
      })
    }
    setNewPosition({ name: "", department: "", level: "", permissions: [] })
  }

  const editPosition = (id: number) => {
    const positionToEdit = positions.find((position) => position.id === id)
    if (positionToEdit) {
      setNewPosition(positionToEdit)
      setEditingId(id)
    }
  }

  const deletePosition = (id: number) => {
    setPositions(positions.filter((position) => position.id !== id))
    toast({
      title: "成功",
      description: "岗位已删除",
    })
  }

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">岗位设置</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in">
        <div>
          <Label htmlFor="name">岗位名称</Label>
          <Input
            id="name"
            value={newPosition.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="输入岗位名称"
          />
        </div>
        <div>
          <Label htmlFor="department">所属部门</Label>
          <Select value={newPosition.department} onValueChange={(value) => handleInputChange("department", value)}>
            <SelectTrigger id="department">
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="level">职级</Label>
          <Select value={newPosition.level} onValueChange={(value) => handleInputChange("level", value)}>
            <SelectTrigger id="level">
              <SelectValue placeholder="选择职级" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>权限</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {allPermissions.map((permission) => (
              <div key={permission.id} className="flex items-center">
                <Checkbox
                  id={permission.id}
                  checked={newPosition.permissions.includes(permission.id)}
                  onCheckedChange={() => handlePermissionChange(permission.id)}
                />
                <label htmlFor={permission.id} className="ml-2 text-sm">
                  {permission.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={addOrUpdatePosition} className="btn-3d mb-6">
        {editingId !== null ? "更新岗位" : "添加岗位"}
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>岗位名称</TableHead>
            <TableHead>所属部门</TableHead>
            <TableHead>职级</TableHead>
            <TableHead>权限</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position) => (
            <TableRow key={position.id}>
              <TableCell>{position.name}</TableCell>
              <TableCell>{position.department}</TableCell>
              <TableCell>{position.level}</TableCell>
              <TableCell>
                {position.permissions.map((p) => allPermissions.find((ap) => ap.id === p)?.name).join(", ")}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => editPosition(position.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deletePosition(position.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
