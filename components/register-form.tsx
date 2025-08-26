"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // 这里应该是实际的注册逻辑
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 模拟发送验证码
    setShowVerification(true)
    setIsLoading(false)
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // 这里应该是实际的验证逻辑
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 模拟注册成功
    onSuccess()
    setIsLoading(false)
  }

  if (showVerification) {
    return (
      <form onSubmit={handleVerification}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="verificationCode">验证码</Label>
            <Input
              id="verificationCode"
              placeholder="请输入验证码"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
        </div>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button className="w-full mt-4" type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "验证中..." : "验证"}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleRegister}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="username">用户名</Label>
          <Input
            id="username"
            placeholder="请输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            type="email"
            placeholder="请输入邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="phone">手机号</Label>
          <Input id="phone" placeholder="请输入手机号" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">姓名</Label>
          <Input id="name" placeholder="请输入姓名" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button className="w-full mt-4" type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isLoading ? "注册中..." : "注册"}
      </Button>
    </form>
  )
}
