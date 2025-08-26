"use client"

// 简化的认证钩子，实际项目中应该使用更完善的认证系统
import { useState, useEffect } from "react"

type UserRole = "admin" | "manager" | "employee"

interface User {
  id: string
  name: string
  role: UserRole
  position: string
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: "user-1",
    name: "张总",
    role: "admin",
    position: "总经理",
  },
  {
    id: "user-2",
    name: "李经理",
    role: "manager",
    position: "直属管理",
  },
  {
    id: "user-3",
    name: "王员工",
    role: "employee",
    position: "员工",
  },
]

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从本地存储获取用户信息
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // 默认使用第一个用户
      setUser(mockUsers[0])
      localStorage.setItem("currentUser", JSON.stringify(mockUsers[0]))
    }
    setLoading(false)
  }, [])

  const login = (userId: string) => {
    const foundUser = mockUsers.find((u) => u.id === userId)
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("currentUser", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const switchUser = (userId: string) => {
    return login(userId)
  }

  return {
    user,
    loading,
    login,
    logout,
    switchUser,
    availableUsers: mockUsers,
  }
}
