"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  FileText,
  Users,
  Calendar,
  Bot,
  DollarSign,
  MessageSquare,
  Award,
  Settings,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// 定义导航项类型
type NavItem = {
  icon: React.ReactNode
  label: string
  href: string
  badge?: number | string
}

// 定义导航组类型
type NavGroup = {
  icon: React.ReactNode
  label: string
  items: NavItem[]
}

// 定义底部导航项
const bottomNavItems: NavItem[] = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "首页",
    href: "/",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "文档",
    href: "/documents",
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    label: "消息",
    href: "/message-center",
    badge: 3,
  },
  {
    icon: <Award className="h-5 w-5" />,
    label: "荣誉",
    href: "/honors",
  },
  {
    icon: <Menu className="h-5 w-5" />,
    label: "更多",
    href: "#",
  },
]

// 定义所有导航组
const navGroups: (NavItem | NavGroup)[] = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "首页导航",
    href: "/",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "文档管理",
    items: [
      {
        icon: <FileText className="h-5 w-5" />,
        label: "文档中心",
        href: "/documents",
      },
      {
        icon: <FileText className="h-5 w-5" />,
        label: "审批流程",
        href: "/approval",
      },
    ],
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "人员管理",
    items: [
      {
        icon: <Users className="h-5 w-5" />,
        label: "员工档案",
        href: "/employee",
      },
      {
        icon: <Users className="h-5 w-5" />,
        label: "组织架构",
        href: "/organization",
      },
      {
        icon: <Users className="h-5 w-5" />,
        label: "岗位设置",
        href: "/position-settings",
      },
      {
        icon: <Users className="h-5 w-5" />,
        label: "客户回访",
        href: "/customer-followup",
      },
    ],
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    label: "日程管理",
    items: [
      {
        icon: <Calendar className="h-5 w-5" />,
        label: "日程安排",
        href: "/calendar",
      },
      {
        icon: <Calendar className="h-5 w-5" />,
        label: "时间节点",
        href: "/timeline",
      },
      {
        icon: <Calendar className="h-5 w-5" />,
        label: "进度跟踪",
        href: "/progress",
      },
    ],
  },
  {
    icon: <Bot className="h-5 w-5" />,
    label: "智能工具",
    items: [
      {
        icon: <Bot className="h-5 w-5" />,
        label: "智能助手",
        href: "/ai-assistant",
      },
      {
        icon: <Bot className="h-5 w-5" />,
        label: "智能维护",
        href: "/ai-maintenance",
      },
      {
        icon: <Bot className="h-5 w-5" />,
        label: "智能设计",
        href: "/design-tools",
      },
    ],
  },
  {
    icon: <DollarSign className="h-5 w-5" />,
    label: "财务管理",
    items: [
      {
        icon: <DollarSign className="h-5 w-5" />,
        label: "收银系统",
        href: "/cashier",
      },
      {
        icon: <DollarSign className="h-5 w-5" />,
        label: "库存管理",
        href: "/inventory",
      },
    ],
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    label: "消息中心",
    href: "/message-center",
    badge: 3,
  },
  {
    icon: <Award className="h-5 w-5" />,
    label: "荣誉展示",
    href: "/honors",
    badge: "新",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "系统设置",
    href: "/settings",
  },
]

export function MobileNavigation() {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<string[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 检查导航项是否激活
  const isNavItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.includes(href)
  }

  // 切换导航组展开/折叠状态
  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  // 根据当前路径自动展开相关组
  useEffect(() => {
    const groupsToExpand = navGroups
      .filter((group) => "items" in group)
      .filter((group) => {
        const items = (group as NavGroup).items
        return items.some((item) => pathname.includes(item.href))
      })
      .map((group) => group.label)

    setOpenGroups(groupsToExpand)
  }, [pathname])

  return (
    <>
      {/* 底部导航栏 - 仅在移动端显示 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden">
        <div className="flex justify-around items-center h-16">
          {bottomNavItems.map((item, index) => {
            const isActive = item.href !== "#" && isNavItemActive(item.href)
            const isLastItem = index === bottomNavItems.length - 1

            if (isLastItem) {
              return (
                <Sheet key={item.label} open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <button className="flex flex-col items-center justify-center w-full h-full">
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-full p-1",
                          isMenuOpen ? "bg-blue-100 text-blue-600" : "text-gray-500",
                        )}
                      >
                        {isMenuOpen ? <X className="h-5 w-5" /> : item.icon}
                      </div>
                      <span className={cn("text-xs mt-1", isMenuOpen ? "text-blue-600" : "text-gray-500")}>
                        {isMenuOpen ? "关闭" : item.label}
                      </span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] pt-10 pb-20">
                    <div className="overflow-y-auto h-full">
                      <div className="space-y-4 p-2">
                        {navGroups.map((item) => {
                          if ("items" in item) {
                            // 导航组
                            const group = item as NavGroup
                            const isOpen = openGroups.includes(group.label)
                            return (
                              <div key={group.label} className="space-y-1">
                                <button
                                  onClick={() => toggleGroup(group.label)}
                                  className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                                >
                                  <div className="flex items-center">
                                    <div className="mr-3 text-gray-500">{group.icon}</div>
                                    <span className="font-medium">{group.label}</span>
                                  </div>
                                  <ChevronRight
                                    className={cn(
                                      "h-5 w-5 text-gray-400 transition-transform",
                                      isOpen ? "rotate-90" : "",
                                    )}
                                  />
                                </button>
                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden pl-10"
                                    >
                                      <div className="space-y-1 py-2">
                                        {group.items.map((subItem) => {
                                          const isSubItemActive = isNavItemActive(subItem.href)
                                          return (
                                            <Link
                                              key={subItem.href}
                                              href={subItem.href}
                                              className={cn(
                                                "flex items-center justify-between p-2 rounded-lg",
                                                isSubItemActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50",
                                              )}
                                              onClick={() => setIsMenuOpen(false)}
                                            >
                                              <div className="flex items-center">
                                                <div className="mr-3">{subItem.icon}</div>
                                                <span>{subItem.label}</span>
                                              </div>
                                              {subItem.badge && (
                                                <div
                                                  className={cn(
                                                    "flex h-5 min-w-5 items-center justify-center rounded-full text-xs font-medium",
                                                    typeof subItem.badge === "number"
                                                      ? "bg-red-500 text-white"
                                                      : "bg-blue-500 text-white",
                                                  )}
                                                >
                                                  {subItem.badge}
                                                </div>
                                              )}
                                            </Link>
                                          )
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          } else {
                            // 单个导航项
                            const navItem = item as NavItem
                            const isActive = isNavItemActive(navItem.href)
                            return (
                              <Link
                                key={navItem.href}
                                href={navItem.href}
                                className={cn(
                                  "flex items-center justify-between p-3 rounded-lg",
                                  isActive ? "bg-blue-50 text-blue-600" : "bg-gray-50 hover:bg-gray-100",
                                )}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="flex items-center">
                                  <div className="mr-3">{navItem.icon}</div>
                                  <span className="font-medium">{navItem.label}</span>
                                </div>
                                {navItem.badge && (
                                  <div
                                    className={cn(
                                      "flex h-5 min-w-5 items-center justify-center rounded-full text-xs font-medium",
                                      typeof navItem.badge === "number"
                                        ? "bg-red-500 text-white"
                                        : "bg-blue-500 text-white",
                                    )}
                                  >
                                    {navItem.badge}
                                  </div>
                                )}
                              </Link>
                            )
                          }
                        })}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center w-full h-full"
                onClick={() => item.href === "#" && setIsMenuOpen(true)}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full p-1",
                    isActive ? "bg-blue-100 text-blue-600" : "text-gray-500",
                  )}
                >
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={cn("text-xs mt-1", isActive ? "text-blue-600" : "text-gray-500")}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 页面底部填充 - 为底部导航栏留出空间 */}
      <div className="h-16 lg:hidden"></div>
    </>
  )
}
