"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, CheckCircle2, ArrowUpRight, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TaskList } from "@/components/workflow/task-list"
import { CalendarView } from "@/components/workflow/calendar-view"
import { NotificationCenter } from "@/components/workflow/notification-center"
import { StatsDashboard } from "@/components/workflow/stats-dashboard"
import { CreateWorkflowDialog } from "@/components/workflow/create-workflow-dialog"
import type { WorkflowInstance } from "@/lib/types/workflow-types"
import { useAuth } from "@/lib/hooks/use-auth"

export default function WorkflowPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("tasks")
  const [instances, setInstances] = useState<WorkflowInstance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  // 获取工作流实例
  useEffect(() => {
    async function fetchInstances() {
      try {
        const response = await fetch("/api/workflow/instances")
        const data = await response.json()
        setInstances(data.instances || [])
      } catch (error) {
        console.error("Error fetching workflow instances:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstances()

    // 初始化示例数据
    fetch("/api/workflow/check-overdue")
      .then(() => fetchInstances())
      .catch((error) => console.error("Error initializing example data:", error))
  }, [])

  // 获取通知数量
  useEffect(() => {
    async function fetchNotificationCount() {
      if (!user) return

      try {
        const position = user.position
        const response = await fetch(`/api/workflow/notifications?position=${position}`)
        const data = await response.json()
        const unreadCount = (data.notifications || []).filter((n: any) => !n.isRead).length
        setNotificationCount(unreadCount)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotificationCount()

    // 设置定时器，每分钟检查一次通知
    const timer = setInterval(fetchNotificationCount, 60000)
    return () => clearInterval(timer)
  }, [user])

  // 定期检查超时任务
  useEffect(() => {
    async function checkOverdueTasks() {
      try {
        await fetch("/api/workflow/check-overdue", { method: "POST" })
      } catch (error) {
        console.error("Error checking overdue tasks:", error)
      }
    }

    // 设置定时器，每分钟检查一次超时任务
    const timer = setInterval(checkOverdueTasks, 60000)
    return () => clearInterval(timer)
  }, [])

  // 刷新数据
  const refreshData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/workflow/instances")
      const data = await response.json()
      setInstances(data.instances || [])
    } catch (error) {
      console.error("Error refreshing workflow instances:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 创建新工作流实例
  const handleCreateWorkflow = async (data: any) => {
    try {
      const response = await fetch("/api/workflow/instances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          createdBy: user?.id || "system",
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setInstances([...instances, result.instance])
        setIsCreateDialogOpen(false)
      } else {
        console.error("Error creating workflow:", result.error)
      }
    } catch (error) {
      console.error("Error creating workflow:", error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">工作流管理</h1>
          <p className="text-gray-600 mt-1">管理和跟踪工作流程，确保任务按时完成</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="relative" onClick={() => setActiveTab("notifications")}>
            <Bell className="h-4 w-4 mr-2" />
            通知
            {notificationCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{notificationCount}</Badge>
            )}
          </Button>
          <Button
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            新建工作流
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>任务列表</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>日历视图</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4" />
            <span>统计分析</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>通知中心</span>
            {notificationCount > 0 && <Badge className="bg-red-500 text-white">{notificationCount}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>任务列表</CardTitle>
              <CardDescription>查看和管理所有工作流任务</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList
                instances={instances}
                userPosition={user?.position || "员工"}
                isLoading={isLoading}
                onRefresh={refreshData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>日历视图</CardTitle>
              <CardDescription>在日历上查看工作流任务安排</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarView
                instances={instances}
                userPosition={user?.position || "员工"}
                isLoading={isLoading}
                onRefresh={refreshData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>统计分析</CardTitle>
              <CardDescription>查看工作流执行情况的统计数据</CardDescription>
            </CardHeader>
            <CardContent>
              <StatsDashboard instances={instances} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>通知中心</CardTitle>
              <CardDescription>查看与工作流相关的所有通知</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationCenter
                userPosition={user?.position || "员工"}
                onNotificationRead={() => {
                  // 更新通知计数
                  const newCount = Math.max(0, notificationCount - 1)
                  setNotificationCount(newCount)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateWorkflowDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateWorkflow}
      />
    </div>
  )
}
