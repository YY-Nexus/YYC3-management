"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { FileText, TrendingUp, Users, Download, Eye, Filter } from "lucide-react"

export default function DocumentAnalyticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [timeRange, setTimeRange] = useState("30days")
  const [activeTab, setActiveTab] = useState("overview")

  // 模拟数据
  const overviewStats = [
    {
      title: "总文档数",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: FileText,
    },
    {
      title: "本月新增",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "活跃用户",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "总下载量",
      value: "2,567",
      change: "+15%",
      trend: "up",
      icon: Download,
    },
  ]

  const documentsByCategory = [
    { name: "财务报告", value: 234, color: "#8884d8" },
    { name: "项目文档", value: 189, color: "#82ca9d" },
    { name: "会议纪要", value: 156, color: "#ffc658" },
    { name: "合同协议", value: 123, color: "#ff7300" },
    { name: "人事文档", value: 98, color: "#00ff88" },
    { name: "其他", value: 434, color: "#8dd1e1" },
  ]

  const monthlyActivity = [
    { month: "1月", created: 45, viewed: 234, downloaded: 89 },
    { month: "2月", created: 52, viewed: 267, downloaded: 95 },
    { month: "3月", created: 48, viewed: 298, downloaded: 102 },
    { month: "4月", created: 61, viewed: 312, downloaded: 118 },
    { month: "5月", created: 55, viewed: 289, downloaded: 108 },
    { month: "6月", created: 67, viewed: 345, downloaded: 125 },
    { month: "7月", created: 59, viewed: 321, downloaded: 115 },
    { month: "8月", created: 72, viewed: 378, downloaded: 142 },
    { month: "9月", created: 68, viewed: 356, downloaded: 138 },
    { month: "10月", created: 74, viewed: 389, downloaded: 149 },
  ]

  const topUsers = [
    { name: "张财务", documents: 45, views: 234, downloads: 89 },
    { name: "李项目", documents: 38, views: 198, downloads: 76 },
    { name: "王秘书", documents: 32, views: 167, downloads: 65 },
    { name: "赵法务", documents: 28, views: 145, downloads: 58 },
    { name: "孙产品", documents: 25, views: 132, downloads: 52 },
  ]

  const popularDocuments = [
    { title: "2023年第三季度财务报告", views: 156, downloads: 45, category: "财务报告" },
    { title: "新员工入职手册", views: 134, downloads: 67, category: "人事文档" },
    { title: "项目管理流程指南", views: 128, downloads: 39, category: "项目文档" },
    { title: "销售合同模板", views: 112, downloads: 58, category: "合同协议" },
    { title: "月度会议纪要模板", views: 98, downloads: 34, category: "会议纪要" },
  ]

  const storageUsage = [
    { type: "Word文档", size: 2.3, percentage: 35, color: "#8884d8" },
    { type: "PDF文件", size: 1.8, percentage: 28, color: "#82ca9d" },
    { type: "Excel表格", size: 1.2, percentage: 18, color: "#ffc658" },
    { type: "图片文件", size: 0.8, percentage: 12, color: "#ff7300" },
    { type: "其他", size: 0.5, percentage: 7, color: "#8dd1e1" },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">文档统计分析</h1>
              <p className="text-muted-foreground">查看文档使用情况和趋势分析</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">最近7天</SelectItem>
                  <SelectItem value="30days">最近30天</SelectItem>
                  <SelectItem value="90days">最近90天</SelectItem>
                  <SelectItem value="1year">最近1年</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter size={16} className="mr-2" />
                筛选
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="activity">活动趋势</TabsTrigger>
              <TabsTrigger value="users">用户分析</TabsTrigger>
              <TabsTrigger value="storage">存储分析</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {overviewStats.map((stat) => (
                  <Card key={stat.title}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-green-600">{stat.change} 较上期</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <stat.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>文档分类分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={documentsByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {documentsByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>热门文档</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {popularDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{doc.title}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye size={12} />
                                <span>{doc.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Download size={12} />
                                <span>{doc.downloads}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">{doc.category}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>月度活动趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={monthlyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="created" stackId="1" stroke="#8884d8" fill="#8884d8" name="创建" />
                      <Area type="monotone" dataKey="viewed" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="查看" />
                      <Area
                        type="monotone"
                        dataKey="downloaded"
                        stackId="1"
                        stroke="#ffc658"
                        fill="#ffc658"
                        name="下载"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>文档创建趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="created" stroke="#8884d8" strokeWidth={2} name="新建文档" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>活跃用户排行</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">创建了 {user.documents} 个文档</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium">{user.views}</p>
                            <p className="text-muted-foreground">查看</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{user.downloads}</p>
                            <p className="text-muted-foreground">下载</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>用户活动分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topUsers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="documents" fill="#8884d8" name="文档数" />
                      <Bar dataKey="views" fill="#82ca9d" name="查看数" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="storage" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>存储使用情况</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={storageUsage}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {storageUsage.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>存储详情</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {storageUsage.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded" style={{ backgroundColor: item.color }}></div>
                            <span className="font-medium">{item.type}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{item.size} GB</p>
                            <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-muted/20 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">总存储空间</span>
                        <span className="font-bold">6.6 GB / 100 GB</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "6.6%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
