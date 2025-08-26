"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/ui/status-badge"
import { CheckCircle2, Clock, AlertTriangle, ArrowUpRight, Calendar, FileText, MessageSquare } from "lucide-react"
import type { WorkflowInstance, WorkflowTask } from "@/lib/types/workflow-types"
import { formatDateTime, getRemainingTime } from "@/lib/utils/date-utils"

interface TaskDetailDialogProps {
  task: WorkflowTask
  instance: WorkflowInstance
  userPosition: string
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function TaskDetailDialog({ task, instance, userPosition, isOpen, onClose, onUpdate }: TaskDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [notes, setNotes] = useState(task.notes || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 检查用户是否可以操作此任务
  const canCompleteTask =
    task.status !== "completed" &&
    (task.assignedTo === userPosition ||
      userPosition === "总经理" ||
      (userPosition === "直属管理" && task.assignedTo === "员工"))

  // 计算紧急程度
  const getUrgencyLevel = () => {
    if (task.status === "completed") {
      return { level: "已完成", color: "bg-green-500" }
    }

    if (task.status === "warning") {
      return { level: "紧急", color: "bg-red-500" }
    }

    const now = new Date()
    const scheduledTime = new Date(task.scheduledTime)
    const diffMs = scheduledTime.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 0) {
      return { level: "已超时", color: "bg-red-500" }
    } else if (diffMins < 30) {
      return { level: "紧急", color: "bg-red-500" }
    } else if (diffMins < 60) {
      return { level: "较紧急", color: "bg-orange-500" }
    } else if (diffMins < 120) {
      return { level: "中等", color: "bg-yellow-500" }
    } else {
      return { level: "普通", color: "bg-green-500" }
    }
  }

  // 处理任务开始
  const handleStartTask = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workflow/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceId: instance.id,
          taskId: task.id,
          status: "in_progress",
          notes: notes || undefined,
        }),
      })

      if (response.ok) {
        onUpdate()
      } else {
        console.error("Failed to start task")
      }
    } catch (error) {
      console.error("Error starting task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理任务完成
  const handleCompleteTask = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workflow/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceId: instance.id,
          taskId: task.id,
          status: "completed",
          notes: notes || undefined,
        }),
      })

      if (response.ok) {
        onUpdate()
      } else {
        console.error("Failed to complete task")
      }
    } catch (error) {
      console.error("Error completing task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const urgency = getUrgencyLevel()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{task.title}</span>
            <StatusBadge status={task.status} />
          </DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">
              <FileText className="h-4 w-4 mr-2" />
              详细信息
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Calendar className="h-4 w-4 mr-2" />
              时间线
            </TabsTrigger>
            <TabsTrigger value="action">
              <MessageSquare className="h-4 w-4 mr-2" />
              操作
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">负责岗位</p>
                <p className="text-sm">{task.assignedTo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">原始负责人</p>
                <p className="text-sm">{task.originalAssignee}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">计划时间</p>
                <p className="text-sm">{formatDateTime(task.scheduledTime)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">剩余时间</p>
                <p className="text-sm">{getRemainingTime(task.scheduledTime)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">分类</p>
                <p className="text-sm">{task.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">紧急程度</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${urgency.color}`}></div>
                  <p className="text-sm">{urgency.level}</p>
                </div>
              </div>
            </div>

            {task.notes && (
              <div className="space-y-1 mt-4">
                <p className="text-sm font-medium">备注</p>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{task.notes}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">计划时间</p>
                  <p className="text-xs text-gray-500">{formatDateTime(task.scheduledTime)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">提醒时间</p>
                  <p className="text-xs text-gray-500">{formatDateTime(task.reminderTime)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <ArrowUpRight className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">升级时间</p>
                  <p className="text-xs text-gray-500">{formatDateTime(task.escalationTime)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">警告时间</p>
                  <p className="text-xs text-gray-500">{formatDateTime(task.warningTime)}</p>
                </div>
              </div>

              {task.startTime && (
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">开始时间</p>
                    <p className="text-xs text-gray-500">{formatDateTime(task.startTime)}</p>
                  </div>
                </div>
              )}

              {task.completionTime && (
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">完成时间</p>
                    <p className="text-xs text-gray-500">{formatDateTime(task.completionTime)}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="action" className="space-y-4">
            {canCompleteTask ? (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium">添加备注</p>
                  <Textarea placeholder="输入任务备注..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                <div className="flex justify-end gap-2">
                  {task.status === "pending" && (
                    <Button onClick={handleStartTask} disabled={isSubmitting}>
                      开始任务
                    </Button>
                  )}

                  <Button
                    onClick={handleCompleteTask}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    标记为已完成
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                {task.status === "completed" ? (
                  <p className="text-gray-500">此任务已完成</p>
                ) : (
                  <p className="text-gray-500">您没有权限操作此任务</p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
