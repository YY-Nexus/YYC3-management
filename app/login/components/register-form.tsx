"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { register } from "@/lib/auth-service"

// 定义表单验证模式
const registerSchema = z
  .object({
    username: z.string().min(3, { message: "用户名至少需要3个字符" }),
    email: z.string().email({ message: "请输入有效的电子邮箱地址" }),
    verificationCode: z.string().min(6, { message: "请输入6位验证码" }),
    password: z.string().min(8, { message: "密码至少需要8个字符" }),
    confirmPassword: z.string(),
    phone: z
      .string()
      .min(11, { message: "请输入有效的手机号码" })
      .regex(/^1[3-9]\d{9}$/, { message: "请输入有效的手机号码" }),
    phoneVerificationCode: z.string().min(6, { message: "请输入6位验证码" }),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "您必须同意服务条款和隐私政策" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不匹配",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailCountdown, setEmailCountdown] = useState(0)
  const [phoneCountdown, setPhoneCountdown] = useState(0)
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const router = useRouter()

  // 初始化表单
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      verificationCode: "",
      password: "",
      confirmPassword: "",
      phone: "",
      phoneVerificationCode: "",
      agreeTerms: false,
    },
  })

  // 处理邮箱验证码倒计时
  useEffect(() => {
    if (emailCountdown > 0) {
      const timer = setTimeout(() => setEmailCountdown(emailCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [emailCountdown])

  // 处理手机验证码倒计时
  useEffect(() => {
    if (phoneCountdown > 0) {
      const timer = setTimeout(() => setPhoneCountdown(phoneCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [phoneCountdown])

  // 发送邮箱验证码
  const sendEmailVerificationCode = async () => {
    const email = form.getValues("email")
    if (!email || !z.string().email().safeParse(email).success) {
      form.setError("email", { message: "请输入有效的电子邮箱地址" })
      return
    }

    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 设置倒计时
      setEmailCountdown(60)

      // 生成6位随机验证码
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

      // 在实际应用中，这里应该发送验证码到用户邮箱
      // 为了演示，我们直接显示验证码
      console.log(`邮箱验证码: ${verificationCode}`)
      alert(`模拟邮箱验证码: ${verificationCode}`)

      // 保存验证码到localStorage（仅用于演示）
      localStorage.setItem("emailVerificationCode", verificationCode)
    } catch (err) {
      setError("发送验证码失败，请稍后再试")
    }
  }

  // 发送手机验证码
  const sendPhoneVerificationCode = async () => {
    const phone = form.getValues("phone")
    if (
      !phone ||
      !z
        .string()
        .regex(/^1[3-9]\d{9}$/)
        .safeParse(phone).success
    ) {
      form.setError("phone", { message: "请输入有效的手机号码" })
      return
    }

    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 设置倒计时
      setPhoneCountdown(60)

      // 生成6位随机验证码
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

      // 在实际应用中，这里应该发送验证码到用户手机
      // 为了演示，我们直接显示验证码
      console.log(`手机验证码: ${verificationCode}`)
      alert(`模拟手机验证码: ${verificationCode}`)

      // 保存验证码到localStorage（仅用于演示）
      localStorage.setItem("phoneVerificationCode", verificationCode)
    } catch (err) {
      setError("发送验证码失败，请稍后再试")
    }
  }

  // 验证邮箱验证码
  const verifyEmailCode = () => {
    const inputCode = form.getValues("verificationCode")
    const savedCode = localStorage.getItem("emailVerificationCode")

    if (inputCode === savedCode) {
      setEmailVerified(true)
      return true
    } else {
      form.setError("verificationCode", { message: "验证码错误" })
      return false
    }
  }

  // 验证手机验证码
  const verifyPhoneCode = () => {
    const inputCode = form.getValues("phoneVerificationCode")
    const savedCode = localStorage.getItem("phoneVerificationCode")

    if (inputCode === savedCode) {
      setPhoneVerified(true)
      return true
    } else {
      form.setError("phoneVerificationCode", { message: "验证码错误" })
      return false
    }
  }

  // 表单提交处理
  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    setError(null)

    // 验证邮箱和手机验证码
    const isEmailValid = verifyEmailCode()
    const isPhoneValid = verifyPhoneCode()

    if (!isEmailValid || !isPhoneValid) {
      setIsLoading(false)
      return
    }

    try {
      // 调用注册服务
      const user = await register({
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        name: data.username,
      })

      if (user) {
        // 注册成功，清除验证码
        localStorage.removeItem("emailVerificationCode")
        localStorage.removeItem("phoneVerificationCode")

        // 设置登录状态
        localStorage.setItem("isLoggedIn", "true")

        // 注册成功后重定向到首页
        window.location.href = "/" // 使用直接页面跳转而不是router.push
      } else {
        setError("注册失败，用户名或邮箱已存在")
      }
    } catch (err) {
      setError("注册失败，请稍后再试")
      console.error("注册错误:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="请输入用户名" {...field} disabled={isLoading} className="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>电子邮箱</FormLabel>
              <FormControl>
                <Input type="email" placeholder="请输入电子邮箱" {...field} disabled={isLoading} className="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱验证码</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="请输入验证码"
                    {...field}
                    disabled={isLoading}
                    className="h-11"
                    onChange={(e) => {
                      field.onChange(e)
                      if (e.target.value.length === 6) {
                        verifyEmailCode()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendEmailVerificationCode}
                    disabled={isLoading || emailCountdown > 0}
                    className="whitespace-nowrap min-w-[120px]"
                  >
                    {emailCountdown > 0 ? `${emailCountdown}秒后重试` : "获取验证码"}
                  </Button>
                </div>
              </FormControl>
              {emailVerified && <p className="text-sm text-green-600">邮箱验证成功</p>}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    {...field}
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>确认密码</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="请再次输入密码"
                    {...field}
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>手机号码</FormLabel>
              <FormControl>
                <Input placeholder="请输入手机号码" {...field} disabled={isLoading} className="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneVerificationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>手机验证码</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="请输入验证码"
                    {...field}
                    disabled={isLoading}
                    className="h-11"
                    onChange={(e) => {
                      field.onChange(e)
                      if (e.target.value.length === 6) {
                        verifyPhoneCode()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendPhoneVerificationCode}
                    disabled={isLoading || phoneCountdown > 0}
                    className="whitespace-nowrap min-w-[120px]"
                  >
                    {phoneCountdown > 0 ? `${phoneCountdown}秒后重试` : "获取验证码"}
                  </Button>
                </div>
              </FormControl>
              {phoneVerified && <p className="text-sm text-green-600">手机验证成功</p>}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreeTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  我同意
                  <Button variant="link" className="p-0 h-auto text-sm font-normal">
                    服务条款
                  </Button>
                  和
                  <Button variant="link" className="p-0 h-auto text-sm font-normal">
                    隐私政策
                  </Button>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              注册中...
            </>
          ) : (
            "注册"
          )}
        </Button>
      </form>
    </Form>
  )
}
