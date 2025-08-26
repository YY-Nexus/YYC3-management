"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown, Plus, Star, TrendingUp, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// 模拟绩效数据
const generatePerformanceData = (employeeId: string) => {
  // 绩效评估记录
  const evaluations = [
    {
      id: "1",
      period: "2023年第一季度",
      date: "2023-04-10",
      score: 85,
      level: "优秀",
      evaluator: "李行政",
      comments: "工作态度积极，能够按时完成任务，团队协作能力强。",
      strengths: ["沟通能力强", "团队协作好", "工作效率高"],
      improvements: ["专业知识需要进一步提升", "创新能力有待加强"],
    },
    {
      id: "2",
      period: "2023年第二季度",
      date: "2023-07-12",
      score: 90,
      level: "优秀",
      evaluator: "李行政",
      comments: "本季度表现出色，能够主动承担责任，解决问题能力强。",
      strengths: ["问题解决能力强", "责任心强", "工作质量高"],
      improvements: ["时间管理需要改进", "可以更多参与团队建设"],
    },
    {
      id: "3",
      period: "2023年第三季度",
      date: "2023-10-15",
      score: 88,
      level: "优秀",
      evaluator: "李行政",
      comments: "继续保持良好表现，客户满意度高，能够有效处理紧急情况。",
      strengths: ["客户服务意识强", "应变能力好", "专业知识扎实"],
      improvements: ["可以提高工作效率", "文档编写需要更加规范"],
    },
    {
      id: "4",
      period: "2023年第四季度",
      date: "2024-01-20",
      score: 92,
      level: "卓越",
      evaluator: "李行政",
      comments: "本季度表现突出，带领团队完成了重要项目，得到客户高度评价。",
      strengths: ["领导能力强", "执行力高", "创新意识好"],
      improvements: ["可以进一步提升战略思维", "培养更多下属"],
    },
  ]

  // 绩效趋势数据
  const trends = [
    { month: "2023-01", score: 82 },
    { month: "2023-02", score: 84 },
    { month: "2023-03", score: 85 },
    { month: "2023-04", score: 86 },
    { month: "2023-05", score: 88 },
    { month: "2023-06", score: 90 },
    { month: "2023-07", score: 89 },
    { month: "2023-08", score: 87 },
    { month: "2023-09", score: 88 },
    { month: "2023-10", score: 90 },
    { month: "2023-11", score: 91 },
    { month: "2023-12", score: 92 },
  ]

  // 目标完成情况
  const goals = [
    {
      id: "1",
      title: "提升客户满意度",
      description: "将客户满意度从85%提升到90%以上",
      startDate: "2023-01-01",
      endDate: "2023-03-31",
      progress: 100,
      status: "已完成",
      result: "客户满意度达到92%，超额完成目标",
    },
    {
      id: "2",
      title: "优化工作流程",
      description: "优化团队工作流程，提高工作效率20%",
      startDate: "2023-04-01",
      endDate: "2023-06-30",
      progress: 90,
      status: "已完成",
      result: "工作效率提升18%，基本达成目标",
    },
    {
      id: "3",
      title: "完成专业技能培训",
      description: "完成3项专业技能的培训和认证",
      startDate: "2023-07-01",
      endDate: "2023-09-30",
      progress: 100,
      status: "已完成",
      result: "完成了4项专业技能培训，获得3项认证",
    },
    {
      id: "4",
      title: "带领团队完成年度重点项目",
      description: "按时保质完成年度重点项目，确保客户满意",
      startDate: "2023-10-01",
      endDate: "2023-12-31",
      progress: 95,
      status: "已完成",
      result: "项目提前一周完成，获得客户好评",
    },
    {
      id: "5",
      title: "提升团队协作能力",
      description: "通过团队建设活动，提升团队凝聚力和协作效率",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      progress: 60,
      status: "进行中",
      result: "已组织2次团队建设活动，团队氛围有所改善",
    },
  ]

  return { evaluations, trends, goals }
}

interface EmployeePerformanceProps {
  employeeId: string
}

export function EmployeePerformance({ employeeId }: EmployeePerformanceProps) {
  const [activeTab, setActiveTab] = useState("evaluations")
  const [year, setYear] = useState("2023")

  // 获取绩效数据
  const { evaluations, trends, goals } = generatePerformanceData(employeeId)

  // 根据评分获取绩效等级样式
  const getPerformanceLevelStyle = (level: string) => {
    switch (level) {
      case "卓越":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "优秀":
        return "bg-green-50 text-green-700 border-green-200"
      case "良好":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "一般":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "需改进":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // 根据目标状态获取样式
  const getGoalStatusStyle = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-50 text-green-700 border-green-200"
      case "进行中":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "已延期":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "已取消":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">绩效管理</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择年份" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022年</SelectItem>
              <SelectItem value="2023">2023年</SelectItem>
              <SelectItem value="2024">2024年</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            导出报告
          </Button>
          <Button className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            新增评估
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="evaluations" className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>绩效评估</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>绩效趋势</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>目标管理</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle>绩效评估记录</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>评估周期</TableHead>
                    <TableHead>评估日期</TableHead>
                    <TableHead>评分</TableHead>
                    <TableHead>等级</TableHead>
                    <TableHead>评估人</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>{evaluation.period}</TableCell>
                      <TableCell>{evaluation.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{evaluation.score}</span>
                          <Progress value={evaluation.score} className="h-2 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPerformanceLevelStyle(evaluation.level)}>
                          {evaluation.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{evaluation.evaluator}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          查看详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {evaluations.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>最新评估详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">评估意见</h3>
                    <p className="text-gray-700">{evaluations[evaluations.length - 1].comments}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">优势</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {evaluations[evaluations.length - 1].strengths.map((strength, index) => (
                          <li key={index} className="text-gray-700">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">改进方向</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {evaluations[evaluations.length - 1].improvements.map((improvement, index) => (
                          <li key={index} className="text-gray-700">
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>绩效趋势分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    score: {
                      label: "绩效评分",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getMonth() + 1}月`
                        }}
                      />
                      <YAxis domain={[60, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--color-score)"
                        name="绩效评分"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {Math.round(trends.reduce((sum, item) => sum + item.score, 0) / trends.length)}
                      </div>
                      <p className="text-sm text-gray-500">年度平均分</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {Math.max(...trends.map((item) => item.score))}
                      </div>
                      <p className="text-sm text-gray-500">最高评分</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        +{trends[trends.length - 1].score - trends[0].score}
                      </div>
                      <p className="text-sm text-gray-500">年度提升</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>目标管理</CardTitle>
              <Button className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                新增目标
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goals.map((goal) => (
                  <Card key={goal.id} className="overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-medium">{goal.title}</h3>
                          <p className="text-gray-600 text-sm">{goal.description}</p>
                        </div>
                        <Badge variant="outline" className={getGoalStatusStyle(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">开始日期</p>
                          <p className="font-medium">{goal.startDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">结束日期</p>
                          <p className="font-medium">{goal.endDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">完成进度</p>
                          <div className="flex items-center gap-2">
                            <Progress value={goal.progress} className="h-2 flex-1" />
                            <span className="font-medium text-sm">{goal.progress}%</span>
                          </div>
                        </div>
                      </div>

                      {goal.result && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">目标结果</p>
                          <p className="text-gray-700">{goal.result}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
