"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock } from "lucide-react"
import type { WorkflowInstance, WorkflowTask } from "@/lib/types/workflow-types"
import { formatTime, isSameDay } from "@/lib/utils/date-utils"
import { TaskDetailDialog } from "@/components/workflow/task-detail-dialog"

interface CalendarViewProps {
  instances: WorkflowInstance[]
  userPosition: string
  isLoading: boolean
  onRefresh: () => void
}

export function CalendarView({ instances, userPosition, isLoading, onRefresh }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTask, setSelectedTask] = useState<{
    task: WorkflowTask
    instance: WorkflowInstance
  } | null>(null)

  // 获取日期的任务
  const getTasksForDate = (date: Date) => {
    return instances.flatMap((instance) =>
      instance.tasks
        .filter((task) => {
          const taskDate = new Date(task.scheduledTime)
          return isSameDay(taskDate, date)
        })
        .map((task) => ({ task, instance })),
    )
  }

  // 日期装饰器
  const dateDecorators = (date: Date) => {
    const tasks = getTasksForDate(date).map(({ task }) => task)

    if (tasks.length === 0) {
      return null
    }

    const hasWarning = tasks.some((task) => task.status === "warning" || task.status === "overdue")
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

  // 处理任务详情
  const handleViewTask = (task: WorkflowTask, instance: WorkflowInstance) => {
    setSelectedTask({ task, instance })
  }

  // 处理任务状态更新
  const handleTaskUpdate = async () => {
    onRefresh()
    setSelectedTask(null)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[350px]" />
        <Skeleton className="h-[350px]" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          decorators={[
            {
              dates: Array.from({ length: 31 }, (_, i) => {
                const date = new Date()
                date.setDate(i + 1)
                return date
              }),
              decorator: ({ date }) => dateDecorators(date),
            },
          ]}
        />
      </div>
      <div>
        <h3 className="font-medium mb-4">{selectedDate ? selectedDate.toLocaleDateString() : "选择日期"} 的任务</h3>
        {selectedDateTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-10">没有任务</p>
        ) : (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {selectedDateTasks.map(({ task, instance }) => (
              <Card
                key={task.id}
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewTask(task, instance)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatTime(task.scheduledTime)}</span>
                      </div>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask.task}
          instance={selectedTask.instance}
          userPosition={userPosition}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  )
}
