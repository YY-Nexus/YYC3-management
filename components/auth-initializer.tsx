"use client"

import { useEffect } from "react"
import { isAuthenticated } from "@/lib/auth-service"

export function AuthInitializer() {
  useEffect(() => {
    // 检查用户是否已登录
    const authenticated = isAuthenticated()

    // 如果已登录，确保 isLoggedIn 状态正确设置
    if (authenticated) {
      localStorage.setItem("isLoggedIn", "true")
    }
  }, [])

  return null
}
