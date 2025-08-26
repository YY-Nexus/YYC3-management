"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { login } from "@/lib/auth-service"

// 定义邮箱登录表单验证模式
const emailLoginSchema = z.object({
  email: z.string().email({ message: "请输入有效的电子邮箱地址" }),
  password: z.string().min(1, { message: "请输入密码" }),
  rememberMe: z.boolean().optional(),
})

// 定义手机号登录表单验证模式
const phoneLoginSchema = z.object({
  phone: z
    .string()
    .min(11, { message: "请输入有效的手机号码" })
    .regex(/^1[3-9]\d{9}$/, { message: "请输入有效的手机号码" }),
  password: z.string().min(1, { message: "请输入密码" }),
  rememberMe: z.boolean().optional(),
})

type EmailLoginFormValues = z.infer<typeof emailLoginSchema>
type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const router = useRouter()

  // 初始化邮箱登录表单
  const emailForm = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // 初始化手机号登录表单
  const phoneForm = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: "",
      password: "",
      rememberMe: false,
    },
  })

  // 修改邮箱登录表单提交处理函数
  async function onEmailSubmit(data: EmailLoginFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // 调用登录服务
      const user = await login(data.email, data.password)

      if (user) {
        // 登录成功，保存记住我状态
        if (data.rememberMe) {
          localStorage.setItem("rememberMe", "true")
        }

        // 登录成功后重定向到首页
        window.location.href = "/" // 使用直接页面跳转而不是router.push
      } else {
        setError("登录失败，邮箱或密码错误")
      }
    } catch (err) {
      setError("登录失败，请稍后再试")
      console.error("登录错误:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // 修改手机号登录表单提交处理函数
  async function onPhoneSubmit(data: PhoneLoginFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // 调用登录服务
      const user = await login(data.phone, data.password)

      if (user) {
        // 登录成功，保存记住我状态
        if (data.rememberMe) {
          localStorage.setItem("rememberMe", "true")
        }

        // 登录成功后重定向到首页
        window.location.href = "/" // 使用直接页面跳转而不是router.push
      } else {
        setError("登录失败，手机号或密码错误")
      }
    } catch (err) {
      setError("登录失败，请稍后再试")
      console.error("登录错误:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as "email" | "phone")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="email">邮箱登录</TabsTrigger>
          <TabsTrigger value="phone">手机号登录</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>电子邮箱</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="请输入电子邮箱"
                        {...field}
                        disabled={isLoading}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emailForm.control}
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

              <div className="flex items-center justify-between">
                <FormField
                  control={emailForm.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email-rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                      <Label htmlFor="email-rememberMe" className="text-sm font-normal cursor-pointer">
                        记住我
                      </Label>
                    </div>
                  )}
                />

                <Button variant="link" className="p-0 h-auto text-sm font-normal">
                  忘记密码?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    登录中...
                  </>
                ) : (
                  "登录"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="phone">
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={phoneForm.control}
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
                control={phoneForm.control}
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

              <div className="flex items-center justify-between">
                <FormField
                  control={phoneForm.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="phone-rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                      <Label htmlFor="phone-rememberMe" className="text-sm font-normal cursor-pointer">
                        记住我
                      </Label>
                    </div>
                  )}
                />

                <Button variant="link" className="p-0 h-auto text-sm font-normal">
                  忘记密码?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    登录中...
                  </>
                ) : (
                  "登录"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">管理员账号: admin@yanyu.cloud / admin123</p>
      </div>
    </div>
  )
}
