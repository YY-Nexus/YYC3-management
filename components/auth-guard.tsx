"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-service"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // 检查用户是否已登录
    const checkAuth = () => {
      // 公开路径，不需要登录
      const publicPaths = ["/login"]

      // 如果当前路径是公开路径，不需要检查
      if (publicPaths.includes(pathname)) {
        setIsChecking(false)
        setIsAuthorized(true)
        return
      }

      // 检查用户是否已登录
      const authenticated = isAuthenticated()

      if (!authenticated) {
        // 未登录，重定向到登录页面
        window.location.href = "/login" // 使用直接页面跳转而不是router.push
      } else {
        // 已登录，允许访问
        setIsAuthorized(true)
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [pathname])

  // 如果正在检查登录状态，显示加载中
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">加载中，请稍候...</p>
        </div>
      </div>
    )
  }

  // 已完成检查，如果已授权则渲染子组件
  return isAuthorized ? <>{children}</> : null
}
