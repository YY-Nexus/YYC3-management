import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, FileText, Calendar, Users, Settings, ChevronLeft, ChevronRight } from "lucide-react"

type SidebarProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      <nav className="space-y-2 p-4">
        <SidebarItem href="/" icon={<Home />} text="首页" isOpen={isOpen} />
        <SidebarItem href="/documents" icon={<FileText />} text="文档管理" isOpen={isOpen} />
        <SidebarItem href="/calendar" icon={<Calendar />} text="日程安排" isOpen={isOpen} />
        <SidebarItem href="/users" icon={<Users />} text="用户管理" isOpen={isOpen} />
        <SidebarItem href="/settings" icon={<Settings />} text="设置" isOpen={isOpen} />
      </nav>
    </div>
  )
}

type SidebarItemProps = {
  href: string
  icon: React.ReactNode
  text: string
  isOpen: boolean
}

function SidebarItem({ href, icon, text, isOpen }: SidebarItemProps) {
  return (
    <Link href={href} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
      {icon}
      {isOpen && <span>{text}</span>}
    </Link>
  )
}
