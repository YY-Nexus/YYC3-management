"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MainNavigation } from "@/components/main-navigation"
import { RecentFiles } from "@/components/recent-files"
import { MultiDimensionalDashboard } from "@/components/multi-dimensional-dashboard"
import { HonorsShowcase } from "@/components/honors-showcase"
import { EmployeeHonorFund } from "@/components/employee-honor-fund"
import { GroupInteractions } from "@/components/group-interactions"
import { PaymentChannels } from "@/components/payment-channels"
import { Badge } from "@/components/ui/badge"
import { BarChart3, FileText, Users, Calendar, Settings, Bell, Briefcase, TrendingUp, Award, Clock } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-wave-pattern">
      <MainNavigation />

      <main className="main-content p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">言语云³ OS</h1>
            <p className="text-gray-600">智能办公经管系统</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">通知</span>
              <Badge className="ml-1 bg-red-500">3</Badge>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">设置</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>仪表盘</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>文档中心</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>团队协作</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>日程安排</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="card-hover card-bg-pattern-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                    业绩概览
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">¥128,430</div>
                  <p className="text-xs text-green-600 mt-1">↑ 12.5% 较上月</p>
                </CardContent>
              </Card>

              <Card className="card-hover card-bg-pattern-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-purple-500" />
                    项目进度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24/36</div>
                  <p className="text-xs text-blue-600 mt-1">6个项目即将到期</p>
                </CardContent>
              </Card>

              <Card className="card-hover card-bg-pattern-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Award className="mr-2 h-5 w-5 text-yellow-500" />
                    团队荣誉
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-xs text-yellow-600 mt-1">本季度新增3项</p>
                </CardContent>
              </Card>

              <Card className="card-hover bg-gradient-blue">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-cyan-500" />
                    待办事项
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8</div>
                  <p className="text-xs text-red-600 mt-1">3项今日截止</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-wave-animated">
                <CardHeader>
                  <CardTitle>多维度数据分析</CardTitle>
                  <CardDescription>业务数据实时监控与分析</CardDescription>
                </CardHeader>
                <CardContent>
                  <MultiDimensionalDashboard />
                </CardContent>
              </Card>

              <Card className="bg-dot-pattern">
                <CardHeader>
                  <CardTitle>最近文件</CardTitle>
                  <CardDescription>您最近处理的文档</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentFiles />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    查看全部文件
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-hex-pattern">
                <CardHeader>
                  <CardTitle>荣誉展示</CardTitle>
                  <CardDescription>团队与个人荣誉墙</CardDescription>
                </CardHeader>
                <CardContent>
                  <HonorsShowcase />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    查看全部荣誉
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-gradient-purple">
                <CardHeader>
                  <CardTitle>员工荣誉基金</CardTitle>
                  <CardDescription>员工激励与福利计划</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmployeeHonorFund />
                </CardContent>
              </Card>

              <Card className="bg-cloud-pattern">
                <CardHeader>
                  <CardTitle>团队互动</CardTitle>
                  <CardDescription>部门间协作与沟通</CardDescription>
                </CardHeader>
                <CardContent>
                  <GroupInteractions />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-curve-pattern">
              <CardHeader>
                <CardTitle>支付渠道分析</CardTitle>
                <CardDescription>各支付渠道使用情况统计</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentChannels />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="bg-gradient-cyan">
              <CardHeader>
                <CardTitle>文档中心</CardTitle>
                <CardDescription>管理和访问您的文档</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">文档中心内容将在这里显示</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="chinese-theme-bg">
              <CardHeader>
                <CardTitle>团队协作</CardTitle>
                <CardDescription>与您的团队成员协作</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">团队协作内容将在这里显示</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="cloud-bg-animated">
              <CardHeader>
                <CardTitle>日程安排</CardTitle>
                <CardDescription>管理您的日程和会议</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">日程安排内容将在这里显示</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
