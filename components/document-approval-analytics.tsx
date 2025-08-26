"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { BarChart3, LineChartIcon, Download, Users, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react"

export function DocumentApprovalAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("month")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // 模拟数据 - 审批概览
  const overviewData = {
    totalApprovals: 256,
    totalApprovalsChange: 12,
    pendingApprovals: 45,
    pendingApprovalsChange: -5,
    averageTime: 1.5,
    averageTimeChange: -0.3,
    approvalRate: 85,
    approvalRateChange: 5,
  }

  // 模拟数据 - 审批类型统计
  const typeData = [
    { name: "财务报告", value: 35, color: "#0088FE" },
    { name: "营销文档", value: 25, color: "#00C49F" },
    { name: "产品文档", value: 15, color: "#FFBB28" },
    { name: "合同文档", value: 10, color: "#FF8042" },
    { name: "人事文档", value: 8, color: "#8884D8" },
    { name: "其他文档", value: 7, color: "#82CA9D" },
  ]

  // 模拟数据 - 审批状态统计
  const statusData = [
    { name: "已批准", value: 65, color: "#4CAF50" },
    { name: "已拒绝", value: 15, color: "#F44336" },
    { name: "待审批", value: 20, color: "#FFC107" },
  ]

  // 模拟数据 - 每月审批数量
  const monthlyData = [
    { name: "1月", 财务报告: 20, 营销文档: 15, 产品文档: 10, 合同文档: 5, 人事文档: 8 },
    { name: "2月", 财务报告: 15, 营销文档: 20, 产品文档: 8, 合同文档: 7, 人事文档: 10 },
    { name: "3月", 财务报告: 25, 营销文档: 18, 产品文档: 12, 合同文档: 9, 人事文档: 7 },
    { name: "4月", 财务报告: 30, 营销文档: 22, 产品文档: 15, 合同文档: 8, 人事文档: 12 },
    { name: "5月", 财务报告: 28, 营销文档: 25, 产品文档: 18, 合同文档: 10, 人事文档: 15 },
    { name: "6月", 财务报告: 35, 营销文档: 30, 产品文档: 20, 合同文档: 12, 人事文档: 18 },
    { name: "7月", 财务报告: 32, 营销文档: 28, 产品文档: 22, 合同文档: 15, 人事文档: 20 },
    { name: "8月", 财务报告: 38, 营销文档: 32, 产品文档: 25, 合同文档: 18, 人事文档: 22 },
    { name: "9月", 财务报告: 42, 营销文档: 35, 产品文档: 28, 合同文档: 20, 人事文档: 25 },
    { name: "10月", 财务报告: 45, 营销文档: 38, 产品文档: 30, 合同文档: 22, 人事文档: 28 },
    { name: "11月", 财务报告: 48, 营销文档: 40, 产品文档: 32, 合同文档: 25, 人事文档: 30 },
    { name: "12月", 财务报告: 50, 营销文档: 45, 产品文档: 35, 合同文档: 28, 人事文档: 32 },
  ]

  // 模拟数据 - 审批时长趋势
  const timelineData = [
    { name: "1月", 平均审批时长: 2.5 },
    { name: "2月", 平均审批时长: 2.3 },
    { name: "3月", 平均审批时长: 2.0 },
    { name: "4月", 平均审批时长: 1.8 },
    { name: "5月", 平均审批时长: 1.7 },
    { name: "6月", 平均审批时长: 1.5 },
    { name: "7月", 平均审批时长: 1.6 },
    { name: "8月", 平均审批时长: 1.4 },
    { name: "9月", 平均审批时长: 1.3 },
    { name: "10月", 平均审批时长: 1.2 },
    { name: "11月", 平均审批时长: 1.1 },
    { name: "12月", 平均审批时长: 1.0 },
  ]

  // 模拟数据 - 部门审批效率
  const departmentData = [
    { name: "技术部", 平均审批时长: 0.8, 审批通过率: 90 },
    { name: "市场部", 平均审批时长: 1.2, 审批通过率: 85 },
    { name: "人事部", 平均审批时长: 1.5, 审批通过率: 80 },
    { name: "销售部", 平均审批时长: 1.8, 审批通过率: 75 },
    { name: "财务部", 平均审批时长: 2.5, 审批通过率: 70 },
  ]

  // 模拟数据 - 审批人效率
  const approverData = [
    { name: "张经理", department: "技术部", 平均审批时长: 0.5, 审批数量: 120, 通过率: 92 },
    { name: "王总监", department: "市场部", 平均审批时长: 0.7, 审批数量: 95, 通过率: 88 },
    { name: "李主管", department: "人事部", 平均审批时长: 0.9, 审批数量: 85, 通过率: 85 },
    { name: "赵经理", department: "销售部", 平均审批时长: 1.2, 审批数量: 75, 通过率: 80 },
    { name: "钱总监", department: "财务部", 平均审批时长: 1.5, 审批数量: 65, 通过率: 75 },
  ]

  // 获取变化指标的样式
  const getChangeStyle = (change: number, inverse = false) => {
    const isPositive = inverse ? change < 0 : change > 0
    return {
      color: isPositive ? "text-green-500" : "text-red-500",
      icon: isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />,
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">审批分析</h1>
          <p className="text-muted-foreground">审批流程数据分析和统计</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              <SelectItem value="tech">技术部</SelectItem>
              <SelectItem value="marketing">市场部</SelectItem>
              <SelectItem value="hr">人事部</SelectItem>
              <SelectItem value="sales">销售部</SelectItem>
              <SelectItem value="finance">财务部</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-1">
            <Download size={16} />
            <span className="hidden md:inline">导出报表</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart3 size={16} />
            概览
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-1">
            <LineChartIcon size={16} />
            趋势
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center gap-1">
            <Clock size={16} />
            效率
          </TabsTrigger>
          <TabsTrigger value="department" className="flex items-center gap-1">
            <Users size={16} />
            部门
          </TabsTrigger>
        </TabsList>

        {/* 概览标签页 */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">审批总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{overviewData.totalApprovals}</div>
                <div className="flex items-center text-xs mt-1">
                  <span className={getChangeStyle(overviewData.totalApprovalsChange).color}>
                    {getChangeStyle(overviewData.totalApprovalsChange).icon}
                    较上月增长 {Math.abs(overviewData.totalApprovalsChange)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">待处理审批</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{overviewData.pendingApprovals}</div>
                <div className="flex items-center text-xs mt-1">
                  <span className={getChangeStyle(overviewData.pendingApprovalsChange, true).color}>
                    {getChangeStyle(overviewData.pendingApprovalsChange, true).icon}
                    较上月减少 {Math.abs(overviewData.pendingApprovalsChange)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">平均审批时长</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{overviewData.averageTime} 天</div>
                <div className="flex items-center text-xs mt-1">
                  <span className={getChangeStyle(overviewData.averageTimeChange, true).color}>
                    {getChangeStyle(overviewData.averageTimeChange, true).icon}
                    较上月减少 {Math.abs(overviewData.averageTimeChange)} 天
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">审批通过率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{overviewData.approvalRate}%</div>
                <div className="flex items-center text-xs mt-1">
                  <span className={getChangeStyle(overviewData.approvalRateChange).color}>
                    {getChangeStyle(overviewData.approvalRateChange).icon}
                    较上月增长 {Math.abs(overviewData.approvalRateChange)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>审批类型分布</CardTitle>
                <CardDescription>各类型文档审批数量占比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {typeData.map((entry, index) => (
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

            <Card>
              <CardHeader>
                <CardTitle>审批状态分布</CardTitle>
                <CardDescription>审批结果状态占比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
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
          </div>
        </TabsContent>

        {/* 趋势标签页 */}
        <TabsContent value="timeline">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>审批数量趋势</CardTitle>
                <CardDescription>各类型文档审批数量月度趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="财务报告" fill="#0088FE" />
                      <Bar dataKey="营销文档" fill="#00C49F" />
                      <Bar dataKey="产品文档" fill="#FFBB28" />
                      <Bar dataKey="合同文档" fill="#FF8042" />
                      <Bar dataKey="人事文档" fill="#8884D8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>审批时长趋势</CardTitle>
                <CardDescription>平均审批时长月度变化趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timelineData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="平均审批时长" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 效率标签页 */}
        <TabsContent value="efficiency">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">最快审批部门</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">技术部</div>
                <p className="text-xs text-muted-foreground">平均 0.8 天</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">最慢审批部门</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">财务部</div>
                <p className="text-xs text-muted-foreground">平均 2.5 天</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">最高效审批人</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">张经理</div>
                <p className="text-xs text-muted-foreground">平均 0.5 天</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>审批人效率排名</CardTitle>
              <CardDescription>按平均审批时长排序</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={approverData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 100,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`${value} 天`, "平均审批时长"]} />
                    <Legend />
                    <Bar dataKey="平均审批时长" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 部门标签页 */}
        <TabsContent value="department">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>部门审批效率对比</CardTitle>
                <CardDescription>各部门平均审批时长和通过率</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="平均审批时长" fill="#8884d8" name="平均审批时长(天)" />
                      <Bar yAxisId="right" dataKey="审批通过率" fill="#82ca9d" name="审批通过率(%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>部门审批数量</CardTitle>
                  <CardDescription>各部门审批数量占比</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "技术部", value: 120, color: "#0088FE" },
                            { name: "市场部", value: 95, color: "#00C49F" },
                            { name: "人事部", value: 85, color: "#FFBB28" },
                            { name: "销售部", value: 75, color: "#FF8042" },
                            { name: "财务部", value: 65, color: "#8884D8" },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {typeData.map((entry, index) => (
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

              <Card>
                <CardHeader>
                  <CardTitle>部门审批通过率</CardTitle>
                  <CardDescription>各部门审批通过率趋势</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { name: "1月", 技术部: 92, 市场部: 88, 人事部: 85, 销售部: 80, 财务部: 75 },
                          { name: "2月", 技术部: 91, 市场部: 87, 人事部: 86, 销售部: 81, 财务部: 76 },
                          { name: "3月", 技术部: 93, 市场部: 89, 人事部: 84, 销售部: 82, 财务部: 77 },
                          { name: "4月", 技术部: 90, 市场部: 86, 人事部: 83, 销售部: 79, 财务部: 74 },
                          { name: "5月", 技术部: 94, 市场部: 90, 人事部: 87, 销售部: 83, 财务部: 78 },
                          { name: "6月", 技术部: 95, 市场部: 91, 人事部: 88, 销售部: 84, 财务部: 79 },
                        ]}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="技术部" stroke="#0088FE" />
                        <Line type="monotone" dataKey="市场部" stroke="#00C49F" />
                        <Line type="monotone" dataKey="人事部" stroke="#FFBB28" />
                        <Line type="monotone" dataKey="销售部" stroke="#FF8042" />
                        <Line type="monotone" dataKey="财务部" stroke="#8884D8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
