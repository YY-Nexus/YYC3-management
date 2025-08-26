"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertTriangle, Plus, Edit2, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
  groupId: string
}

type Group = {
  id: string
  name: string
  description: string
  members: string[]
}

export default function MessageCenter() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "系统", content: "欢迎使用信息中心！", timestamp: "09:00", groupId: "general" },
    { id: 2, sender: "张三", content: "大家好，今天的会议几点开始？", timestamp: "09:05", groupId: "general" },
    { id: 3, sender: "李四", content: "上午10点，在3号会议室", timestamp: "09:07", groupId: "general" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [groups, setGroups] = useState<Group[]>([
    { id: "general", name: "全体群组", description: "所有员工的公共群组", members: ["所有人"] },
    { id: "tech", name: "技术部", description: "技术部门的群组", members: ["张三", "李四", "王五"] },
    { id: "marketing", name: "市场部", description: "市场部门的群组", members: ["赵六", "钱七", "孙八"] },
  ])
  const [selectedGroup, setSelectedGroup] = useState<string>("general")
  const [newGroup, setNewGroup] = useState<Omit<Group, "id">>({ name: "", description: "", members: [] })
  const [isAdmin, setIsAdmin] = useState(true) // 这里应该根据实际的用户角色来设置
  const [isEditingGroup, setIsEditingGroup] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)

  const sendMessage = () => {
    if (newMessage.trim()) {
      const now = new Date()
      const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "我", // 这里应该是当前登录用户的名字
          content: newMessage.trim(),
          timestamp: timestamp,
          groupId: selectedGroup,
        },
      ])
      setNewMessage("")
    }
  }

  const handleComplaint = () => {
    // 这里应该跳转到投诉反馈页面或打开投诉反馈模态框
    toast({
      title: "投诉反馈",
      description: "正在跳转到投诉反馈页面...",
    })
  }

  const createOrUpdateGroup = () => {
    if (newGroup.name && newGroup.description) {
      if (isEditingGroup && editingGroupId) {
        setGroups(groups.map((group) => (group.id === editingGroupId ? { ...newGroup, id: editingGroupId } : group)))
        toast({
          title: "群组更新成功",
          description: `群组 "${newGroup.name}" 已更新。`,
        })
      } else {
        const newGroupWithId = { ...newGroup, id: Date.now().toString() }
        setGroups([...groups, newGroupWithId])
        toast({
          title: "群组创建成功",
          description: `新群组 "${newGroup.name}" 已创建。`,
        })
      }
      setNewGroup({ name: "", description: "", members: [] })
      setIsEditingGroup(false)
      setEditingGroupId(null)
    }
  }

  const startEditGroup = (group: Group) => {
    setNewGroup(group)
    setIsEditingGroup(true)
    setEditingGroupId(group.id)
  }

  const deleteGroup = (groupId: string) => {
    setGroups(groups.filter((group) => group.id !== groupId))
    if (selectedGroup === groupId) {
      setSelectedGroup("general")
    }
    toast({
      title: "群组删除成功",
      description: "群组已被删除。",
    })
  }

  return (
    <div className="p-6 h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">信息中心</h1>
        {isAdmin && (
          <Button onClick={handleComplaint} className="btn-3d flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            投诉反馈
          </Button>
        )}
      </div>

      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/4 pr-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">群组</h2>
          {groups.map((group) => (
            <div
              key={group.id}
              className={`p-2 mb-2 rounded cursor-pointer flex justify-between items-center ${
                selectedGroup === group.id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedGroup(group.id)}
            >
              <span>{group.name}</span>
              {isAdmin && group.id !== "general" && (
                <div>
                  <Button variant="ghost" size="icon" onClick={() => startEditGroup(group)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteGroup(group.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          {isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  创建新群组
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isEditingGroup ? "编辑群组" : "创建新群组"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      名称
                    </Label>
                    <Input
                      id="name"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      描述
                    </Label>
                    <Input
                      id="description"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={createOrUpdateGroup}>{isEditingGroup ? "更新群组" : "创建群组"}</Button>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex-grow flex flex-col">
          <div className="flex-grow overflow-auto mb-4 bg-white rounded-lg shadow-inner p-4 tech-border">
            {messages
              .filter((message) => message.groupId === selectedGroup)
              .map((message) => (
                <div key={message.id} className="mb-4 flex items-start animate-slide-in">
                  <Avatar className="mr-2">
                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {message.sender} <span className="text-sm font-normal text-gray-500">{message.timestamp}</span>
                    </div>
                    <div className="mt-1 text-gray-700">{message.content}</div>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="输入消息..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-grow"
            />
            <Button onClick={sendMessage} className="btn-3d">
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
