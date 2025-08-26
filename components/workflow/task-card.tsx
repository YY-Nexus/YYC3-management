"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Clock, Calendar, User } from "lucide-react"
import type { WorkflowTask } from "@/lib/types/workflow-types"
import { formatDateTime } from "@/lib/utils/date-utils"

interface TaskCardProps {
  task: WorkflowTask
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  // 计算紧急程度
  const getUrgencyIndicator = () => {
    if (task.status === "completed") {
      return null
    }

    if (task.status === "warning" || task.status === "overdue") {
      return (
        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      )
    }

    const now = new Date()
    const scheduledTime = new Date(task.scheduledTime)
    const diffMs = scheduledTime.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 0) {
      return (
        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      )
    } else if (diffMins < 30) {
      return (
        <div className="absolute top-0 right-0 w-3 h-3 bg-orange-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      )
    } else if (diffMins < 60) {
      return (
        <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      )
    }

    return null
  }

  return (
    <Card className="relative hover:shadow-md transition-shadow">
      {getUrgencyIndicator()}
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{task.title}</h3>
          <StatusBadge status={task.status} />
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDateTime(task.scheduledTime)}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{task.assignedTo}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{task.category}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full" onClick={onClick}>
          查看详情
        </Button>
      </CardFooter>
    </Card>
  )
}
