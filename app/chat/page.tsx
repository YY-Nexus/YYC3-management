"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertTriangle } from "lucide-react"

type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "系统", content: "欢迎使用智能办公系统聊天功能！", timestamp: "09:00" },
    { id: 2, sender: "张三", content: "大家好，今天的会议几点开始？", timestamp: "09:05" },
    { id: 3, sender: "李四", content: "上午10点，在3号会议室", timestamp: "09:07" },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [isAdmin, setIsAdmin] = useState(false) // 这里应该根据实际的用户角色来设置

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
        },
      ])
      setNewMessage("")
    }
  }

  const handleComplaint = () => {
    // 这里应该跳转到投诉反馈页面或打开投诉反馈模态框
    alert("跳转到投诉反馈页面")
  }

  return (
    <div className="p-6 h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">聊天</h1>
        {isAdmin && (
          <Button onClick={handleComplaint} className="btn-3d flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            投诉反馈
          </Button>
        )}
      </div>

      <div className="flex-grow overflow-auto mb-4 bg-white rounded-lg shadow-inner p-4 tech-border">
        {messages.map((message) => (
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
  )
}
