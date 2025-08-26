"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter } from "lucide-react"
import { TaskCard } from "@/components/workflow/task-card"
import { TaskDetailDialog } from "@/components/workflow/task-detail-dialog"
import type { WorkflowInstance, WorkflowTask } from "@/lib/types/workflow-types"
import { Skeleton } from "@/components/ui/skeleton"

interface TaskListProps {
  instances: WorkflowInstance[]
  userPosition: string
  isLoading: boolean
  onRefresh: () => void
}

export function TaskList({ instances, userPosition, isLoading, onRefresh }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [viewMode, setViewMode] = useState("all")
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

    // 视图模式
    const matchesViewMode = viewMode === "all" || (viewMode === "my" && task.assignedTo === userPosition)

    return matchesSearch && matchesStatus && matchesCategory && matchesViewMode
  })

  // 获取所有分类
  const allCategories = [...new Set(allTasks.map(({ task }) => task.category))]

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="搜索任务..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="in_progress">处理中</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="escalated">已升级</SelectItem>
              <SelectItem value="warning">警告</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">全部任务</TabsTrigger>
          <TabsTrigger value="my">我的任务</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">没有找到匹配的任务</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map(({ task, instance }) => (
                <TaskCard key={task.id} task={task} onClick={() => handleViewTask(task, instance)} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my" className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">没有找到匹配的任务</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map(({ task, instance }) => (
                <TaskCard key={task.id} task={task} onClick={() => handleViewTask(task, instance)} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

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
