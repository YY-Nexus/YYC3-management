"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Clock, AlertTriangle, CheckCircle, Circle } from "lucide-react"
import type { WorkflowInstance } from "@/lib/models/workflow-types"

interface WorkflowCalendarProps {
  instances: WorkflowInstance[]
  isLoading: boolean
}

export function WorkflowCalendar({ instances, isLoading }: WorkflowCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // 获取日期的任务
  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]

    return instances.flatMap((instance) =>
      instance.tasks.filter((task) => {
        const taskDate = new Date(task.scheduledTime).toISOString().split("T")[0]
        return taskDate === dateString
      }),
    )
  }

  // 日期装饰器
  const dateDecorators = (date: Date) => {
    const tasks = getTasksForDate(date)

    if (tasks.length === 0) {
      return null
    }

    const hasWarning = tasks.some((task) => task.status === "warning")
    const hasEscalated = tasks.some((task) => task.status === "escalated")
    const hasPending = tasks.some((task) => task.status === "pending" || task.status === "in_progress")
    const allCompleted = tasks.every((task) => task.status === "completed")

    if (hasWarning) {
      return <div className="w-2 h-2 bg-red-500 rounded-full absolute bottom-0 right-0" />
    } else if (hasEscalated) {
      return <div className="w-2 h-2 bg-yellow-500 rounded-full absolute bottom-0 right-0" />
    } else if (hasPending) {
      return <div className="w-2 h-2 bg-blue-500 rounded-full absolute bottom-0 right-0" />
    } else if (allCompleted) {
      return <div className="w-2 h-2 bg-green-500 rounded-full absolute bottom-0 right-0" />
    }

    return null
  }

  // 获取选中日期的任务
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-gray-100">
            <Circle className="w-3 h-3 mr-1" />
            待处理
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            处理中
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            已完成
          </Badge>
        )
      case "escalated":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            已升级
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            警告
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 日历视图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            工作流日历
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasTask: (date) => getTasksForDate(date).length > 0,
              hasWarning: (date) => getTasksForDate(date).some((task) => task.status === "warning"),
              hasEscalated: (date) => getTasksForDate(date).some((task) => task.status === "escalated"),
              completed: (date) => {
                const tasks = getTasksForDate(date)
                return tasks.length > 0 && tasks.every((task) => task.status === "completed")
              },
            }}
            modifiersStyles={{
              hasTask: { backgroundColor: "#e3f2fd" },
              hasWarning: { backgroundColor: "#ffebee", color: "#c62828" },
              hasEscalated: { backgroundColor: "#fff3e0", color: "#ef6c00" },
              completed: { backgroundColor: "#e8f5e8", color: "#2e7d32" },
            }}
          />

          {/* 图例 */}
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium">图例：</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 rounded" />
                <span>有任务</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 rounded" />
                <span>已完成</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-100 rounded" />
                <span>已升级</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 rounded" />
                <span>有警告</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 任务详情 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? `${selectedDate.toLocaleDateString("zh-CN")} 的任务` : "选择日期查看任务"}
          </CardTitle>
          {selectedDateTasks.length > 0 && (
            <div className="text-sm text-gray-500">共 {selectedDateTasks.length} 个任务</div>
          )}
        </CardHeader>
        <CardContent>
          {selectedDateTasks.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">{selectedDate ? "这一天没有安排任务" : "请选择日期查看任务"}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {selectedDateTasks.map((task) => (
                <Card key={task.id} className={`border-l-4 ${getPriorityColor(task.priority || "low")}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatTime(task.scheduledTime)}
                        </p>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>

                    {task.description && <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>}

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">{task.assignee && `负责人: ${task.assignee}`}</div>
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        查看详情
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
