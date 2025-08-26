"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  FileText,
  Home,
  Settings,
  Users,
  Clock,
  BarChart2,
  UserCheck,
  GitMerge,
  FileCheck2,
  MessageSquare,
  Bot,
  Briefcase,
  Palette,
  PenToolIcon as Tool,
  DollarSign,
  Package,
  ChevronRight,
  Menu,
  X,
  Search,
  Award,
  Star,
  Bookmark,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserProfile } from "@/components/user-profile"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// 定义导航项的类型接口
interface NavItemProps {
  icon: React.ReactNode
  label: string
  href: string
  isActive?: boolean
  isMobile?: boolean
  onClick?: () => void
  badge?: number | string
  id: string
}

interface NavGroupProps {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
  isMobile?: boolean
  onToggle?: () => void
}

// 定义导航数据结构，使字数一致
const navGroups = [
  {
    id: "home",
    icon: <Home className="w-5 h-5" />,
    label: "首页导航",
    type: "item",
    href: "/",
  },
  {
    id: "docs",
    icon: <FileText className="w-5 h-5" />,
    label: "文档管理",
    type: "group",
    items: [
      {
        id: "documents",
        icon: <FileText className="w-5 h-5" />,
        label: "文档中心",
        href: "/documents",
      },
      {
        id: "approval",
        icon: <FileCheck2 className="w-5 h-5" />,
        label: "审批流程",
        href: "/approval",
      },
    ],
  },
  {
    id: "hr",
    icon: <Users className="w-5 h-5" />,
    label: "人员管理",
    type: "group",
    items: [
      {
        id: "personnel",
        icon: <Users className="w-5 h-5" />,
        label: "人员管理",
        href: "/personnel",
      },
      {
        id: "organization",
        icon: <GitMerge className="w-5 h-5" />,
        label: "组织架构",
        href: "/organization",
      },
      {
        id: "position",
        icon: <Briefcase className="w-5 h-5" />,
        label: "岗位设置",
        href: "/position-settings",
      },
      {
        id: "customer",
        icon: <UserCheck className="w-5 h-5" />,
        label: "客户回访",
        href: "/customer-followup",
      },
    ],
  },
  {
    id: "schedule",
    icon: <Calendar className="w-5 h-5" />,
    label: "日程管理",
    type: "group",
    items: [
      {
        id: "calendar",
        icon: <Calendar className="w-5 h-5" />,
        label: "日程安排",
        href: "/calendar",
      },
      {
        id: "timeline",
        icon: <Clock className="w-5 h-5" />,
        label: "时间节点",
        href: "/timeline",
      },
      {
        id: "progress",
        icon: <BarChart2 className="w-5 h-5" />,
        label: "进度跟踪",
        href: "/progress",
      },
    ],
  },
  {
    id: "ai",
    icon: <Bot className="w-5 h-5" />,
    label: "智能工具",
    type: "group",
    items: [
      {
        id: "assistant",
        icon: <Bot className="w-5 h-5" />,
        label: "智能助手",
        href: "/ai-assistant",
      },
      {
        id: "maintenance",
        icon: <Tool className="w-5 h-5" />,
        label: "智能维护",
        href: "/ai-maintenance",
      },
      {
        id: "design",
        icon: <Palette className="w-5 h-5" />,
        label: "智能设计",
        href: "/design-tools",
      },
    ],
  },
  {
    id: "finance",
    icon: <DollarSign className="w-5 h-5" />,
    label: "财务管理",
    type: "group",
    items: [
      {
        id: "cashier",
        icon: <DollarSign className="w-5 h-5" />,
        label: "收银系统",
        href: "/cashier",
      },
      {
        id: "inventory",
        icon: <Package className="w-5 h-5" />,
        label: "库存管理",
        href: "/inventory",
      },
    ],
  },
  {
    id: "message",
    icon: <MessageSquare className="w-5 h-5" />,
    label: "消息中心",
    type: "item",
    href: "/message-center",
    badge: 3,
  },
  {
    id: "honors",
    icon: <Award className="w-5 h-5" />,
    label: "荣誉展示",
    type: "item",
    href: "/honors",
    badge: "新",
  },
  {
    id: "settings",
    icon: <Settings className="w-5 h-5" />,
    label: "系统设置",
    type: "item",
    href: "/settings",
  },
]

// 获取所有可收藏的导航项
const getAllNavItems = () => {
  const items: NavItemProps[] = []

  navGroups.forEach((group) => {
    if (group.type === "item") {
      items.push({
        id: group.id,
        icon: group.icon,
        label: group.label,
        href: group.href,
        badge: group.badge,
      })
    } else if (group.type === "group") {
      group.items.forEach((item) => {
        items.push({
          id: item.id,
          icon: item.icon,
          label: item.label,
          href: item.href,
          badge: item.badge,
        })
      })
    }
  })

  return items
}

export function MainNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [openGroups, setOpenGroups] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFavorites, setShowFavorites] = useState(true)
  const pathname = usePathname()
  const { toast } = useToast()

  // 从本地存储加载收藏夹
  useEffect(() => {
    const storedFavorites = localStorage.getItem("navFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  // 保存收藏夹到本地存储
  useEffect(() => {
    localStorage.setItem("navFavorites", JSON.stringify(favorites))
  }, [favorites])

  // 检测屏幕尺寸
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    // 根据当前路径自动展开相关组
    const autoExpandGroups = () => {
      const groupsToExpand = navGroups
        .filter((group) => group.type === "group")
        .filter((group) => {
          const items = group.items as { href: string }[]
          return items.some((item) => pathname.includes(item.href))
        })
        .map((group) => group.id)

      setOpenGroups(groupsToExpand)
    }

    autoExpandGroups()

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [pathname])

  // 关闭移动菜单的函数
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // 切换组展开/折叠状态
  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  // 检查导航项是否激活
  const isNavItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.includes(href)
  }

  // 添加到收藏夹
  const addToFavorites = (itemId: string) => {
    if (!favorites.includes(itemId)) {
      setFavorites([...favorites, itemId])
      toast({
        title: "已添加到收藏",
        description: "您可以在收藏夹中快速访问此项目",
      })
    }
  }

  // 从收藏夹移除
  const removeFromFavorites = (itemId: string) => {
    setFavorites(favorites.filter((id) => id !== itemId))
    toast({
      title: "已从收藏中移除",
      description: "此项目已从您的收藏夹中移除",
    })
  }

  // 获取收藏的导航项
  const getFavoriteItems = () => {
    const allItems = getAllNavItems()
    return allItems.filter((item) => favorites.includes(item.id))
  }

  // 过滤搜索结果
  const filteredNavGroups = searchQuery
    ? navGroups.filter((group) => {
        if (group.type === "item") {
          return group.label.toLowerCase().includes(searchQuery.toLowerCase())
        } else {
          return (
            group.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.items.some((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        }
      })
    : navGroups

  return (
    <>
      {/* 桌面导航 */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white shadow-lg z-30 transition-all duration-300 ease-in-out",
          isMobileView ? (isMobileMenuOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full") : "w-64",
        )}
      >
        <div className="flex flex-col h-full">
          {/* 品牌标志 */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">Y</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                言语云³
              </span>
            </Link>
            {isMobileView && (
              <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* 搜索框 */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索功能模块..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            {/* 收藏夹部分 */}
            {favorites.length > 0 && (
              <div className="mb-4">
                <div
                  className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => setShowFavorites(!showFavorites)}
                >
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>我的收藏</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-gray-500 transition-transform duration-200",
                      showFavorites ? "rotate-90" : "",
                    )}
                  />
                </div>
                <AnimatePresence>
                  {showFavorites && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4"
                    >
                      <div className="space-y-1 py-1">
                        {getFavoriteItems().map((item) => (
                          <NavItem
                            key={`fav-${item.id}`}
                            id={item.id}
                            icon={item.icon}
                            label={item.label}
                            href={item.href}
                            isActive={isNavItemActive(item.href)}
                            isMobile={isMobileView}
                            onClick={isMobileView ? closeMobileMenu : undefined}
                            badge={item.badge}
                            isFavorite={true}
                            onRemoveFromFavorites={() => removeFromFavorites(item.id)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* 主导航部分 */}
            <div className="space-y-1">
              {filteredNavGroups.map((item) => {
                if (item.type === "item") {
                  return (
                    <NavItem
                      key={item.id}
                      id={item.id}
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      isActive={isNavItemActive(item.href)}
                      isMobile={isMobileView}
                      onClick={isMobileView ? closeMobileMenu : undefined}
                      badge={item.badge}
                      isFavorite={favorites.includes(item.id)}
                      onAddToFavorites={() => addToFavorites(item.id)}
                      onRemoveFromFavorites={() => removeFromFavorites(item.id)}
                    />
                  )
                } else if (item.type === "group") {
                  const isOpen = openGroups.includes(item.id)
                  return (
                    <NavGroup
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      defaultOpen={isOpen}
                      isMobile={isMobileView}
                      onToggle={() => toggleGroup(item.id)}
                    >
                      {item.items.map((subItem) => (
                        <NavItem
                          key={`${item.id}-${subItem.id}`}
                          id={subItem.id}
                          icon={subItem.icon}
                          label={subItem.label}
                          href={subItem.href}
                          isActive={isNavItemActive(subItem.href)}
                          isMobile={isMobileView}
                          onClick={isMobileView ? closeMobileMenu : undefined}
                          badge={subItem.badge}
                          isFavorite={favorites.includes(subItem.id)}
                          onAddToFavorites={() => addToFavorites(subItem.id)}
                          onRemoveFromFavorites={() => removeFromFavorites(subItem.id)}
                        />
                      ))}
                    </NavGroup>
                  )
                }
                return null
              })}
            </div>
          </nav>

          {/* 底部用户信息 */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <UserProfile />
            </div>
          </div>
        </div>
      </aside>

      {/* 移动端菜单按钮 */}
      {isMobileView && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-40 bg-white shadow-md rounded-full"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* 移动端菜单背景遮罩 */}
      {isMobileView && isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-20" onClick={closeMobileMenu} />}
    </>
  )
}

function NavItem({
  icon,
  label,
  href,
  isActive,
  isMobile,
  onClick,
  badge,
  id,
  isFavorite,
  onAddToFavorites,
  onRemoveFromFavorites,
}: NavItemProps & {
  isFavorite?: boolean
  onAddToFavorites?: () => void
  onRemoveFromFavorites?: () => void
}) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className={cn(
          "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700" : "text-gray-700 hover:bg-gray-100",
        )}
        onClick={onClick}
      >
        <div
          className={cn(
            "mr-3 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200",
            isActive
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md group-hover:shadow-lg"
              : "bg-gray-100 text-gray-700 group-hover:bg-gray-200",
          )}
        >
          {icon}
        </div>
        <span className="flex-1">{label}</span>
        {badge && (
          <div
            className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full text-xs font-medium",
              typeof badge === "number"
                ? "bg-red-500 text-white"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
            )}
          >
            {badge}
          </div>
        )}
        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
      </Link>

      {/* 收藏按钮 */}
      {!isFavorite ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onAddToFavorites}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Bookmark className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>添加到收藏</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onRemoveFromFavorites}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Bookmark className="h-4 w-4 text-yellow-500 fill-yellow-500 hover:text-red-500 hover:fill-red-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>从收藏中移除</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

function NavGroup({ icon, label, children, defaultOpen = false, isMobile = false, onToggle }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  useEffect(() => {
    setIsOpen(defaultOpen)
  }, [defaultOpen])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (onToggle) onToggle()
  }

  return (
    <div className="space-y-1">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 group"
      >
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700 group-hover:bg-gray-200 transition-all duration-200">
          {icon}
        </div>
        <span className="flex-1 text-left">{label}</span>
        <ChevronRight
          className={cn("h-4 w-4 text-gray-500 transition-transform duration-200", isOpen ? "rotate-90" : "")}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-11"
          >
            <div className="space-y-1 py-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

{
  /* 3. 添加荣誉详情页面 */
}

{
  /* 现在，让我们创建荣誉详情页面： */
}
