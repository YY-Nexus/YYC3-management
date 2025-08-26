"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { WorkflowInstance } from "@/lib/types/workflow-types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, Calendar, Clock, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react"

interface StatsDashboardProps {
  instances: WorkflowInstance[]
  isLoading: boolean
}

export function StatsDashboard({ instances, isLoading }: StatsDashboardProps) {
  const [timeRange, setTimeRange] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载数据中...</p>
        </div>
      </div>
    )
  }

  if (instances.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">暂无数据</h3>
          <p className="text-muted-foreground">创建工作流实例后，这里将显示统计数据</p>
        </div>
      </div>
    )
  }

  // 获取所有任务
  const allTasks = instances.flatMap((instance) => instance.tasks)

  // 按状态统计任务
  const tasksByStatus = {
    pending: allTasks.filter((task) => task.status === "pending").length,
    in_progress: allTasks.filter((task) => task.status === "in_progress").length,
    completed: allTasks.filter((task) => task.status === "completed").length,
    escalated: allTasks.filter((task) => task.status === "escalated").length,
    warning: allTasks.filter((task) => task.status === "warning").length,
    overdue: allTasks.filter((task) => task.status === "overdue").length,
  }

  // 按分类统计任务
  const tasksByCategory = allTasks.reduce(
    (acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // 按负责人统计任务
  const tasksByAssignee = allTasks.reduce(
    (acc, task) => {
      acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // 计算完成率
  const completionRate = allTasks.length > 0 ? Math.round((tasksByStatus.completed / allTasks.length) * 100) : 0

  // 计算升级率
  const escalationRate = allTasks.length > 0 ? Math.round((tasksByStatus.escalated / allTasks.length) * 100) : 0

  // 准备图表数据
  const statusChartData = [
    { name: "待处理", value: tasksByStatus.pending, color: "#94a3b8" },
    { name: "处理中", value: tasksByStatus.in_progress, color: "#3b82f6" },
    { name: "已完成", value: tasksByStatus.completed, color: "#22c55e" },
    { name: "已升级", value: tasksByStatus.escalated, color: "#f59e0b" },
    { name: "警告", value: tasksByStatus.warning, color: "#ef4444" },
    { name: "已超时", value: tasksByStatus.overdue, color: "#7c3aed" },
  ]

  const categoryChartData = Object.entries(tasksByCategory).map(([category, count]) => ({
    name: category,
    value: count,
  }))

  const assigneeChartData = Object.entries(tasksByAssignee).map(([assignee, count]) => ({
    name: assignee,
    value: count,
  }))

  // 导出报表
  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalInstances: instances.length,
        totalTasks: allTasks.length,
        completionRate,
        escalationRate,
      },
      tasksByStatus,
      tasksByCategory,
      tasksByAssignee,
      instances: instances.map((instance) => ({
        id: instance.id,
        name: instance.name,
        status: instance.status,
        startTime: instance.startTime,
        endTime: instance.endTime,
        tasksCount: instance.tasks.length,
        completedTasksCount: instance.tasks.filter((t) => t.status === "completed").length,
      })),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `workflow-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择时间范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部时间</SelectItem>
            <SelectItem value="today">今天</SelectItem>
            <SelectItem value="week">本周</SelectItem>
            <SelectItem value="month">本月</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportReport}>
          <Download className="mr-2 h-4 w-4" />
          导出报表
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>总工作流</CardDescription>
            <CardTitle className="text-2xl">{instances.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              最近更新: {new Date().toLocaleDateString("zh-CN")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>总任务数</CardDescription>
            <CardTitle className="text-2xl">{allTasks.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              活跃任务: {tasksByStatus.pending + tasksByStatus.in_progress}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>完成率</CardDescription>
            <CardTitle className="text-2xl">{completionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              已完成: {tasksByStatus.completed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>升级率</CardDescription>
            <CardTitle className="text-2xl">{escalationRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              已升级: {tasksByStatus.escalated}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="status">状态分析</TabsTrigger>
          <TabsTrigger value="category">分类分析</TabsTrigger>
          <TabsTrigger value="assignee">负责人分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>工作流概览</CardTitle>
              <CardDescription>所有工作流的整体情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="任务数量">
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>任务状态分布</CardTitle>
              <CardDescription>各状态任务的数量分布</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>任务分类分布</CardTitle>
              <CardDescription>各分类任务的数量分布</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="任务数量" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignee" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>负责人任务分布</CardTitle>
              <CardDescription>各负责人的任务数量分布</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assigneeChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="任务数量" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
