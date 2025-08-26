"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function ForgotPasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (step === 1) {
      // 发送重置密码邮件
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setStep(2)
    } else if (step === 2) {
      // 验证验证码
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setStep(3)
    } else if (step === 3) {
      // 重置密码
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onSuccess()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {step === 1 && (
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            type="email"
            placeholder="请输入您的注册邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="verificationCode">验证码</Label>
          <Input
            id="verificationCode"
            placeholder="请输入验证码"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="newPassword">新密码</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="请输入新密码"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button className="w-full mt-4" type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isLoading ? "处理中..." : step === 1 ? "发送验证码" : step === 2 ? "验证" : "重置密码"}
      </Button>
    </form>
  )
}
