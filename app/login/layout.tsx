import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "登录 - 智能办公经管系统",
  description: "登录到智能办公经管系统",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={inter.className}>{children}</div>
}
