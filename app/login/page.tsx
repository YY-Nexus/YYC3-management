"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LoginForm } from "./components/login-form"
import { RegisterForm } from "./components/register-form"
import { BrandShowcase } from "./components/brand-showcase"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  // 检测屏幕尺寸
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* 左侧品牌展示区 */}
      <div className="w-full md:w-1/2 relative">
        <BrandShowcase />
      </div>

      {/* 右侧功能区 */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{activeTab === "login" ? "欢迎回来" : "创建新账户"}</h2>
            <p className="text-gray-600 mt-2">
              {activeTab === "login" ? "登录您的账户以访问管理系统" : "注册一个新账户以开始使用我们的服务"}
            </p>
          </div>

          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="register">注册</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <RegisterForm />
            </TabsContent>
          </Tabs>

          <div className="text-center mt-8 text-sm text-gray-600">
            <p>
              {activeTab === "login" ? "还没有账户？" : "已有账户？"}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
              >
                {activeTab === "login" ? "立即注册" : "立即登录"}
              </Button>
            </p>
            <p className="mt-2">
              <Button variant="link" className="p-0 h-auto font-normal">
                隐私政策
              </Button>
              {" · "}
              <Button variant="link" className="p-0 h-auto font-normal">
                服务条款
              </Button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
