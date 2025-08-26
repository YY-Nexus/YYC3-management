// 用户类型定义
export type UserRole = "admin" | "manager" | "user"

export interface User {
  id: string
  username: string
  email: string
  phone?: string
  role: UserRole
  name: string
  avatar?: string
}

// 预设管理员账号
const ADMIN_USERS = [
  {
    id: "1",
    username: "admin",
    email: "admin@yanyu.cloud",
    phone: "13800138000",
    password: "admin123",
    role: "admin" as UserRole,
    name: "系统管理员",
    avatar: "/avatar-admin.png",
  },
  {
    id: "2",
    username: "manager",
    email: "manager@yanyu.cloud",
    phone: "13800138001",
    password: "manager123",
    role: "manager" as UserRole,
    name: "部门经理",
    avatar: "/avatar-manager.png",
  },
]

// 模拟用户数据库
const users = [...ADMIN_USERS]

// 登录方法
export async function login(identifier: string, password: string): Promise<User | null> {
  // 模拟API请求延迟
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 查找用户（通过邮箱、用户名或手机号）
  const user = users.find((u) => u.email === identifier || u.username === identifier || u.phone === identifier)

  // 验证密码
  if (user && user.password === password) {
    // 不返回密码
    const { password, ...userWithoutPassword } = user

    // 保存登录状态到localStorage
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
    localStorage.setItem("isLoggedIn", "true") // 添加这一行，明确设置登录状态

    return userWithoutPassword
  }

  return null
}

// 注册方法
export async function register(userData: {
  username: string
  email: string
  password: string
  phone?: string
  name?: string
}): Promise<User | null> {
  // 模拟API请求延迟
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 检查用户名或邮箱是否已存在
  const userExists = users.some(
    (u) =>
      u.username === userData.username || u.email === userData.email || (userData.phone && u.phone === userData.phone),
  )

  if (userExists) {
    return null
  }

  // 创建新用户
  const newUser = {
    id: String(users.length + 1),
    username: userData.username,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
    role: "user" as UserRole,
    name: userData.name || userData.username,
  }

  // 添加到用户列表
  users.push(newUser)

  // 不返回密码
  const { password, ...userWithoutPassword } = newUser

  // 保存登录状态到localStorage
  localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

  return userWithoutPassword
}

// 登出方法
export function logout(): void {
  localStorage.removeItem("currentUser")
  localStorage.removeItem("isLoggedIn") // 添加这一行，确保登录状态被清除
}

// 获取当前用户
export function getCurrentUser(): User | null {
  const userJson = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null
  return userJson ? JSON.parse(userJson) : null
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  // 同时检查 currentUser 和 isLoggedIn 状态
  const userJson = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null
  const isLoggedIn = typeof window !== "undefined" ? localStorage.getItem("isLoggedIn") === "true" : false

  return userJson !== null && isLoggedIn
}

// 检查是否是管理员
export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user !== null && user.role === "admin"
}
