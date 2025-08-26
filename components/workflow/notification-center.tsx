"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, AlertTriangle, ArrowUpRight } from "lucide-react"
import type { NotificationRecord } from "@/lib/types/workflow-types"
import { formatDateTime } from "@/lib/utils/date-utils"
import { Skeleton } from "@/components/ui/skeleton"

interface NotificationCenterProps {
  userPosition: string
  onNotificationRead: () => void
}

export function NotificationCenter({ userPosition, onNotificationRead }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 获取通知
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch(`/api/workflow/notifications?position=${userPosition}`)
        const data = await response.json()
        setNotifications(data.notifications || [])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userPosition) {
      fetchNotifications()
    }

    // 设置定时器，每分钟刷新一次通知
    const timer = setInterval(() => {
      if (userPosition) {
        fetchNotifications()
      }
    }, 60000)

    return () => clearInterval(timer)
  }, [userPosition])

  // 标记通知为已读
  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/workflow/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setNotifications(
          notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification,
          ),
        )
        onNotificationRead()
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // 获取通知图标
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "escalation":
        return <ArrowUpRight className="h-5 w-5 text-yellow-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "completion":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-10">
        <Bell className="h-10 w-10 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">没有通知</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`overflow-hidden transition-colors ${
            notification.isRead ? "bg-gray-50" : "bg-white border-l-4 border-l-blue-500"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1">
                <p className={`${notification.isRead ? "text-gray-600" : "font-medium"}`}>{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{formatDateTime(notification.sentTime)}</p>
              </div>
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  标记为已读
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
