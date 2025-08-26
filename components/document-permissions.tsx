"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Lock, Users, Plus, Trash2, Eye, Edit, Download, Share2 } from "lucide-react"

type Permission = "view" | "edit" | "download" | "share" | "admin"

type UserPermission = {
  id: string
  name: string
  email: string
  avatar: string
  permissions: Permission[]
  role: "owner" | "editor" | "viewer"
}

interface DocumentPermissionsProps {
  documentId: string
}

export function DocumentPermissions({ documentId }: DocumentPermissionsProps) {
  const { toast } = useToast()
  const [isPublic, setIsPublic] = useState(false)
  const [allowComments, setAllowComments] = useState(true)
  const [allowDownload, setAllowDownload] = useState(true)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<"editor" | "viewer">("viewer")
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([
    {
      id: "1",
      name: "张财务",
      email: "zhang@company.com",
      avatar: "",
      permissions: ["view", "edit", "download", "share", "admin"],
      role: "owner",
    },
    {
      id: "2",
      name: "李经理",
      email: "li@company.com",
      avatar: "",
      permissions: ["view", "edit", "download"],
      role: "editor",
    },
    {
      id: "3",
      name: "王总监",
      email: "wang@company.com",
      avatar: "",
      permissions: ["view", "download"],
      role: "viewer",
    },
  ])

  const handleAddUser = () => {
    if (!newUserEmail.trim()) return

    const newUser: UserPermission = {
      id: Date.now().toString(),
      name: newUserEmail.split("@")[0],
      email: newUserEmail,
      avatar: "",
      permissions: newUserRole === "editor" ? ["view", "edit", "download"] : ["view"],
      role: newUserRole,
    }

    setUserPermissions([...userPermissions, newUser])
    setNewUserEmail("")
    setNewUserRole("viewer")
    toast({
      title: "用户已添加",
      description: `已为 ${newUserEmail} 设置${newUserRole === "editor" ? "编辑" : "查看"}权限`,
    })
  }

  const handleRemoveUser = (userId: string) => {
    setUserPermissions(userPermissions.filter((user) => user.id !== userId))
    toast({
      title: "用户已移除",
      description: "用户权限已被移除",
    })
  }

  const handleRoleChange = (userId: string, newRole: "editor" | "viewer") => {
    setUserPermissions(
      userPermissions.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: newRole,
              permissions: newRole === "editor" ? ["view", "edit", "download"] : ["view"],
            }
          : user,
      ),
    )
    toast({
      title: "权限已更新",
      description: `用户权限已更新为${newRole === "editor" ? "编辑者" : "查看者"}`,
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Lock size={14} className="text-yellow-600" />
      case "editor":
        return <Edit size={14} className="text-blue-600" />
      case "viewer":
        return <Eye size={14} className="text-green-600" />
      default:
        return <Users size={14} />
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case "owner":
        return "所有者"
      case "editor":
        return "编辑者"
      case "viewer":
        return "查看者"
      default:
        return role
    }
  }

  const getPermissionIcon = (permission: Permission) => {
    switch (permission) {
      case "view":
        return <Eye size={12} />
      case "edit":
        return <Edit size={12} />
      case "download":
        return <Download size={12} />
      case "share":
        return <Share2 size={12} />
      case "admin":
        return <Lock size={12} />
      default:
        return null
    }
  }

  const getPermissionName = (permission: Permission) => {
    switch (permission) {
      case "view":
        return "查看"
      case "edit":
        return "编辑"
      case "download":
        return "下载"
      case "share":
        return "分享"
      case "admin":
        return "管理"
      default:
        return permission
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} />
            访问设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-access">公开访问</Label>
              <p className="text-sm text-muted-foreground">允许任何人通过链接访问此文档</p>
            </div>
            <Switch id="public-access" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-comments">允许评论</Label>
              <p className="text-sm text-muted-foreground">允许用户在文档上添加评论</p>
            </div>
            <Switch id="allow-comments" checked={allowComments} onCheckedChange={setAllowComments} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-download">允许下载</Label>
              <p className="text-sm text-muted-foreground">允许用户下载此文档</p>
            </div>
            <Switch id="allow-download" checked={allowDownload} onCheckedChange={setAllowDownload} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            用户权限
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="输入邮箱地址"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="flex-1"
            />
            <Select value={newUserRole} onValueChange={(value: "editor" | "viewer") => setNewUserRole(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">查看者</SelectItem>
                <SelectItem value="editor">编辑者</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddUser} disabled={!newUserEmail.trim()}>
              <Plus size={16} />
            </Button>
          </div>

          <div className="space-y-3">
            {userPermissions.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-sm">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.name}</span>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        {getRoleName(user.role)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {user.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs flex items-center gap-1">
                          {getPermissionIcon(permission)}
                          {getPermissionName(permission)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.role !== "owner" && (
                    <>
                      <Select
                        value={user.role}
                        onValueChange={(value: "editor" | "viewer") => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">查看者</SelectItem>
                          <SelectItem value="editor">编辑者</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveUser(user.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
