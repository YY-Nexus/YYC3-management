"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import type { WorkflowInstance, WorkflowTask } from "@/lib/models/workflow-types"
import { TaskDetailDialog } from "./task-detail-dialog"

interface WorkflowTaskListProps {
  instances: WorkflowInstance[]
  searchTerm: string
  statusFilter: string
  categoryFilter: string
  userPosition: string
  isLoading: boolean
  onRefresh: () => void
}

export function WorkflowTaskList({
  instances,
  searchTerm,
  statusFilter,
  categoryFilter,
  userPosition,
  isLoading,
  onRefresh,
}: WorkflowTaskListProps) {
  const [selectedTask, setSelectedTask] = useState<{
    task: WorkflowTask
    instance: WorkflowInstance
  } | null>(null)

  // 获取所有任务
  const allTasks = instances.flatMap((instance) => instance.tasks.map((task) => ({ task, instance })))

  // 筛选任务
  const filteredTasks = allTasks.filter(({ task }) => {
    // 搜索条件
    const matchesSearch =
      searchTerm === "" ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    // 状态筛选
    const matchesStatus = statusFilter === "all" || task.status === statusFilter

    // 分类筛选
    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // 根据状态获取徽章变体
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-gray-100">
            待处理
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            处理中
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            已完成
          </Badge>
        )
      case "escalated":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            已升级
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            警告
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

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
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">没有找到匹配的任务</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>任务名称</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>负责人</TableHead>
            <TableHead>计划时间</TableHead>
            <TableHead>分类</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map(({ task, instance }) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>{getStatusBadge(task.status)}</TableCell>
              <TableCell>{task.assignedTo}</TableCell>
              <TableCell>{formatDateTime(task.scheduledTime)}</TableCell>
              <TableCell>{task.category}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewTask(task, instance)}>
                      <Eye className="mr-2 h-4 w-4" />
                      查看详情
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
