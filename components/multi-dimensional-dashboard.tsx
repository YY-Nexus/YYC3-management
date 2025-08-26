"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const departmentPerformance = [
  { department: "技术部", performance: 92 },
  { department: "市场部", performance: 88 },
  { department: "人事部", performance: 95 },
  { department: "财务部", performance: 90 },
  { department: "运营部", performance: 87 },
]

const monthlyAttendance = [
  { month: "1月", attendance: 95 },
  { month: "2月", attendance: 93 },
  { month: "3月", attendance: 97 },
  { month: "4月", attendance: 94 },
  { month: "5月", attendance: 96 },
  { month: "6月", attendance: 98 },
]

const employeeDistribution = [
  { name: "全职", value: 70 },
  { name: "兼职", value: 15 },
  { name: "实习", value: 10 },
  { name: "外包", value: 5 },
]

export function MultiDimensionalDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>部门绩效对比</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentPerformance}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="performance" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>月度出勤率趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyAttendance}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>员工类型分布</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={employeeDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>员工统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold">总员工数</h3>
              <p className="text-3xl font-bold">256</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">本月新入职</h3>
              <p className="text-3xl font-bold">12</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">离职率</h3>
              <p className="text-3xl font-bold">2.3%</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">人均工作年限</h3>
              <p className="text-3xl font-bold">3.5年</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
