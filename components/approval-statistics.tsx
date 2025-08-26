"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, XCircle, BarChart3 } from "lucide-react"

export function ApprovalStatistics() {
  // 这里应该有实际的数据获取逻辑
  const stats = {
    pending: 12,
    approved: 45,
    rejected: 8,
    total: 65,
    efficiency: 85,
    avgTime: 2.3,
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待审批</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              较上周 {stats.pending > 10 ? "增加" : "减少"} {Math.abs(stats.pending - 10)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已批准</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              较上周 {stats.approved > 40 ? "增加" : "减少"} {Math.abs(stats.approved - 40)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已拒绝</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              较上周 {stats.rejected > 10 ? "增加" : "减少"} {Math.abs(stats.rejected - 10)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">审批效率</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.efficiency}%</div>
            <p className="text-xs text-muted-foreground">平均审批时间 {stats.avgTime} 天</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="week">本周</TabsTrigger>
          <TabsTrigger value="month">本月</TabsTrigger>
          <TabsTrigger value="year">本年</TabsTrigger>
        </TabsList>
        <TabsContent value="week" className="space-y-4">
          <div className="h-[200px] w-full bg-muted/30 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">审批统计图表（本周）</p>
          </div>
        </TabsContent>
        <TabsContent value="month" className="space-y-4">
          <div className="h-[200px] w-full bg-muted/30 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">审批统计图表（本月）</p>
          </div>
        </TabsContent>
        <TabsContent value="year" className="space-y-4">
          <div className="h-[200px] w-full bg-muted/30 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">审批统计图表（本年）</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
