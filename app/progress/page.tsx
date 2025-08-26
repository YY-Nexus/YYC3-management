"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BarChart, PieChart, Bar, Pie, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Cell } from "recharts"
import {
  Search,
  Calendar,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BarChart2,
  List,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// 项目数据
const projectsData = [
  {
    id: 1,
    name: "产品开发",
    progress: 75,
    status: "进行中",
    priority: "高",
    startDate: "2023-01-15",
    endDate: "2023-06-30",
    department: "研发部",
    manager: "张明",
    team: ["李华", "王芳", "赵强", "钱伟"],
    milestones: [
      { name: "需求分析", progress: 100, dueDate: "2023-02-15" },
      { name: "设计阶段", progress: 100, dueDate: "2023-03-30" },
      { name: "开发阶段", progress: 80, dueDate: "2023-05-15" },
      { name: "测试阶段", progress: 40, dueDate: "2023-06-15" },
      { name: "发布上线", progress: 0, dueDate: "2023-06-30" },
    ],
    updates: [
      { date: "2023-05-10", content: "完成核心功能开发", author: "李华" },
      { date: "2023-05-05", content: "UI设计修改完成", author: "王芳" },
      { date: "2023-04-28", content: "后端API开发完成80%", author: "赵强" },
    ],
    risks: [
      { description: "测试资源不足", level: "中", mitigation: "临时调配测试人员" },
      { description: "客户需求变更", level: "高", mitigation: "加强沟通，控制变更范围" },
    ],
    description: "开发新一代智能办公系统，提升企业协作效率",
  },
  {
    id: 2,
    name: "市场营销",
    progress: 60,
    status: "进行中",
    priority: "中",
    startDate: "2023-02-01",
    endDate: "2023-07-31",
    department: "市场部",
    manager: "刘洋",
    team: ["陈静", "杨光", "周明", "吴佳"],
    milestones: [
      { name: "市场调研", progress: 100, dueDate: "2023-03-01" },
      { name: "营销策略", progress: 100, dueDate: "2023-04-15" },
      { name: "内容创作", progress: 70, dueDate: "2023-06-01" },
      { name: "活动执行", progress: 30, dueDate: "2023-07-15" },
      { name: "效果评估", progress: 0, dueDate: "2023-07-31" },
    ],
    updates: [
      { date: "2023-05-12", content: "社交媒体宣传计划启动", author: "陈静" },
      { date: "2023-05-03", content: "完成品牌故事视频拍摄", author: "杨光" },
      { date: "2023-04-25", content: "确定主要推广渠道", author: "刘洋" },
    ],
    risks: [
      { description: "竞品营销活动冲突", level: "中", mitigation: "调整推广时间和渠道" },
      { description: "预算限制", level: "低", mitigation: "优化资源分配" },
    ],
    description: "提升品牌知名度和市场份额的综合营销计划",
  },
  {
    id: 3,
    name: "客户服务",
    progress: 90,
    status: "即将完成",
    priority: "中",
    startDate: "2023-01-01",
    endDate: "2023-05-31",
    department: "客服部",
    manager: "孙丽",
    team: ["郑强", "黄敏", "朱伟", "冯兰"],
    milestones: [
      { name: "服务流程优化", progress: 100, dueDate: "2023-02-15" },
      { name: "客服培训", progress: 100, dueDate: "2023-03-15" },
      { name: "系统升级", progress: 100, dueDate: "2023-04-15" },
      { name: "客户反馈收集", progress: 90, dueDate: "2023-05-15" },
      { name: "服务质量评估", progress: 60, dueDate: "2023-05-31" },
    ],
    updates: [
      { date: "2023-05-14", content: "客户满意度调查启动", author: "黄敏" },
      { date: "2023-05-08", content: "完成全部客服人员培训", author: "孙丽" },
      { date: "2023-05-01", content: "客服系统升级完成", author: "朱伟" },
    ],
    risks: [{ description: "系统稳定性问题", level: "低", mitigation: "加强监控和维护" }],
    description: "提升客户服务质量和效率的综合改进计划",
  },
  {
    id: 4,
    name: "财务管理",
    progress: 40,
    status: "延期",
    priority: "高",
    startDate: "2023-03-01",
    endDate: "2023-08-31",
    department: "财务部",
    manager: "赵琳",
    team: ["钱明", "孙强", "李静", "周伟"],
    milestones: [
      { name: "需求分析", progress: 100, dueDate: "2023-03-31" },
      { name: "系统选型", progress: 100, dueDate: "2023-04-30" },
      { name: "数据迁移", progress: 50, dueDate: "2023-06-30" },
      { name: "系统测试", progress: 10, dueDate: "2023-07-31" },
      { name: "上线运行", progress: 0, dueDate: "2023-08-31" },
    ],
    updates: [
      { date: "2023-05-13", content: "数据迁移遇到兼容性问题", author: "钱明" },
      { date: "2023-05-06", content: "完成系统配置", author: "孙强" },
      { date: "2023-04-28", content: "确定系统供应商", author: "赵琳" },
    ],
    risks: [
      { description: "数据迁移复杂度高", level: "高", mitigation: "增加技术支持资源" },
      { description: "用户适应新系统困难", level: "中", mitigation: "加强培训和文档支持" },
      { description: "系统集成问题", level: "高", mitigation: "提前进行兼容性测试" },
    ],
    description: "升级财务管理系统，提高财务数据的准确性和处理效率",
  },
  {
    id: 5,
    name: "人力资源",
    progress: 55,
    status: "进行中",
    priority: "中",
    startDate: "2023-02-15",
    endDate: "2023-07-15",
    department: "人事部",
    manager: "王丽",
    team: ["张强", "刘芳", "陈伟", "杨静"],
    milestones: [
      { name: "需求调研", progress: 100, dueDate: "2023-03-15" },
      { name: "流程优化", progress: 100, dueDate: "2023-04-15" },
      { name: "系统开发", progress: 70, dueDate: "2023-06-15" },
      { name: "试运行", progress: 0, dueDate: "2023-07-01" },
      { name: "正式上线", progress: 0, dueDate: "2023-07-15" },
    ],
    updates: [
      { date: "2023-05-15", content: "完成员工自助模块开发", author: "张强" },
      { date: "2023-05-08", content: "招聘流程优化方案确定", author: "王丽" },
      { date: "2023-05-01", content: "完成绩效管理模块设计", author: "刘芳" },
    ],
    risks: [
      { description: "员工接受度不高", level: "中", mitigation: "加强内部沟通和培训" },
      { description: "数据安全问题", level: "高", mitigation: "强化系统安全措施" },
    ],
    description: "优化人力资源管理流程，提升HR工作效率和员工体验",
  },
  {
    id: 6,
    name: "供应链优化",
    progress: 65,
    status: "进行中",
    priority: "高",
    startDate: "2023-01-10",
    endDate: "2023-06-20",
    department: "运营部",
    manager: "郑明",
    team: ["李强", "王伟", "张静", "刘芳"],
    milestones: [
      { name: "供应商评估", progress: 100, dueDate: "2023-02-10" },
      { name: "流程重组", progress: 100, dueDate: "2023-03-20" },
      { name: "系统整合", progress: 80, dueDate: "2023-05-10" },
      { name: "员工培训", progress: 40, dueDate: "2023-06-01" },
      { name: "全面实施", progress: 0, dueDate: "2023-06-20" },
    ],
    updates: [
      { date: "2023-05-12", content: "完成主要供应商系统对接", author: "李强" },
      { date: "2023-05-05", content: "库存管理模块上线", author: "王伟" },
      { date: "2023-04-28", content: "采购流程优化完成", author: "郑明" },
    ],
    risks: [
      { description: "供应商配合度不足", level: "中", mitigation: "加强沟通和激励措施" },
      { description: "系统整合复杂", level: "高", mitigation: "分阶段实施，确保稳定" },
    ],
    description: "优化供应链管理，提高采购效率和降低库存成本",
  },
  {
    id: 7,
    name: "数字化转型",
    progress: 30,
    status: "进行中",
    priority: "高",
    startDate: "2023-03-01",
    endDate: "2023-12-31",
    department: "信息技术部",
    manager: "陈强",
    team: ["张伟", "王芳", "李明", "赵静"],
    milestones: [
      { name: "战略规划", progress: 100, dueDate: "2023-04-15" },
      { name: "技术选型", progress: 90, dueDate: "2023-05-31" },
      { name: "基础设施升级", progress: 40, dueDate: "2023-08-15" },
      { name: "应用开发", progress: 10, dueDate: "2023-10-31" },
      { name: "全面部署", progress: 0, dueDate: "2023-12-31" },
    ],
    updates: [
      { date: "2023-05-14", content: "完成云平台选型", author: "陈强" },
      { date: "2023-05-07", content: "数据中心升级方案确定", author: "张伟" },
      { date: "2023-04-30", content: "完成IT基础设施评估", author: "李明" },
    ],
    risks: [
      { description: "技术复杂度高", level: "高", mitigation: "引入外部专家顾问" },
      { description: "预算超支风险", level: "中", mitigation: "严格控制成本，分阶段投入" },
      { description: "业务中断风险", level: "高", mitigation: "制定详细的切换计划和回退方案" },
    ],
    description: "全面推进企业数字化转型，构建智能化业务平台",
  },
  {
    id: 8,
    name: "品牌升级",
    progress: 85,
    status: "即将完成",
    priority: "中",
    startDate: "2023-02-01",
    endDate: "2023-05-31",
    department: "市场部",
    manager: "杨明",
    team: ["李芳", "王强", "张静", "刘伟"],
    milestones: [
      { name: "市场调研", progress: 100, dueDate: "2023-02-28" },
      { name: "品牌定位", progress: 100, dueDate: "2023-03-15" },
      { name: "视觉设计", progress: 100, dueDate: "2023-04-15" },
      { name: "内部推广", progress: 90, dueDate: "2023-05-15" },
      { name: "外部发布", progress: 50, dueDate: "2023-05-31" },
    ],
    updates: [
      { date: "2023-05-15", content: "新品牌手册分发完成", author: "杨明" },
      { date: "2023-05-08", content: "员工品牌培训进行中", author: "李芳" },
      { date: "2023-05-01", content: "新LOGO设计确定", author: "王强" },
    ],
    risks: [
      { description: "市场接受度不确定", level: "中", mitigation: "加强市场沟通和宣传" },
      { description: "内部执行不一致", level: "低", mitigation: "制定详细的品牌指南和培训" },
    ],
    description: "更新企业品牌形象，提升品牌价值和市场认知度",
  },
]

// 状态颜色映射
const statusColors = {
  进行中: "bg-blue-500",
  即将完成: "bg-green-500",
  延期: "bg-red-500",
  已完成: "bg-gray-500",
  未开始: "bg-yellow-500",
}

// 优先级颜色映射
const priorityColors = {
  高: "bg-red-500",
  中: "bg-yellow-500",
  低: "bg-green-500",
}

// 图表颜色
const chartColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00c49f", "#ffbb28", "#ff8042"]

export default function ProgressTracker() {
  const [projects, setProjects] = useState(projectsData)
  const [filteredProjects, setFilteredProjects] = useState(projectsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("全部")
  const [priorityFilter, setPriorityFilter] = useState("全部")
  const [departmentFilter, setDepartmentFilter] = useState("全部")
  const [sortBy, setSortBy] = useState("progress")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedProject, setSelectedProject] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [newUpdate, setNewUpdate] = useState("")

  // 获取所有部门列表
  const departments = ["全部", ...new Set(projects.map((project) => project.department))]

  // 筛选和排序项目
  useEffect(() => {
    let result = [...projects]

    // 搜索
    if (searchTerm) {
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // 状态筛选
    if (statusFilter !== "全部") {
      result = result.filter((project) => project.status === statusFilter)
    }

    // 优先级筛选
    if (priorityFilter !== "全部") {
      result = result.filter((project) => project.priority === priorityFilter)
    }

    // 部门筛选
    if (departmentFilter !== "全部") {
      result = result.filter((project) => project.department === departmentFilter)
    }

    // 排序
    result.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy] > b[sortBy] ? 1 : -1
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1
      }
    })

    setFilteredProjects(result)
  }, [projects, searchTerm, statusFilter, priorityFilter, departmentFilter, sortBy, sortOrder])

  // 处理排序
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  // 添加项目更新
  const addProjectUpdate = () => {
    if (!newUpdate.trim()) return

    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          updates: [
            {
              date: new Date().toISOString().split("T")[0],
              content: newUpdate,
              author: "当前用户", // 实际应用中应该使用登录用户信息
            },
            ...project.updates,
          ],
        }
      }
      return project
    })

    setProjects(updatedProjects)
    setNewUpdate("")
    setSelectedProject(updatedProjects.find((p) => p.id === selectedProject.id))
  }

  // 更新项目进度
  const updateProjectProgress = (projectId, newProgress) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          progress: newProgress,
        }
      }
      return project
    })

    setProjects(updatedProjects)
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(updatedProjects.find((p) => p.id === projectId))
    }
  }

  // 准备图表数据
  const progressChartData = projects.map((project) => ({
    name: project.name,
    progress: project.progress,
    remaining: 100 - project.progress,
  }))

  const statusChartData = Object.entries(
    projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    }, {}),
  ).map(([name, value]) => ({ name, value }))

  const departmentChartData = Object.entries(
    projects.reduce((acc, project) => {
      acc[project.department] = (acc[project.department] || 0) + 1
      return acc
    }, {}),
  ).map(([name, value]) => ({ name, value }))

  const timelineData = projects
    .flatMap((project) =>
      project.milestones.map((milestone) => ({
        project: project.name,
        milestone: milestone.name,
        dueDate: milestone.dueDate,
        progress: milestone.progress,
      })),
    )
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">落地情况跟踪</h1>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>导出报告</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>添加项目</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">项目列表</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">数据概览</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">时间线</span>
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">风险管理</span>
          </TabsTrigger>
        </TabsList>

        {/* 项目列表视图 */}
        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索项目名称、负责人..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部状态</SelectItem>
                  <SelectItem value="进行中">进行中</SelectItem>
                  <SelectItem value="即将完成">即将完成</SelectItem>
                  <SelectItem value="延期">延期</SelectItem>
                  <SelectItem value="已完成">已完成</SelectItem>
                  <SelectItem value="未开始">未开始</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="优先级筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部优先级</SelectItem>
                  <SelectItem value="高">高</SelectItem>
                  <SelectItem value="中">中</SelectItem>
                  <SelectItem value="低">低</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="部门筛选" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("progress")}
                className="flex items-center gap-1"
              >
                进度
                {sortBy === "progress" &&
                  (sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("priority")}
                className="flex items-center gap-1"
              >
                优先级
                {sortBy === "priority" &&
                  (sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
              </Button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">没有找到匹配的项目</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {project.name}
                          <Badge className={`${statusColors[project.status]} text-white`}>{project.status}</Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {project.department} · 负责人: {project.manager}
                        </CardDescription>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>项目操作</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedProject(project)}>查看详情</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingProject(project)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            编辑项目
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            删除项目
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>完成进度</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {project.startDate} 至 {project.endDate}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`border-2 ${priorityColors[project.priority]} border-opacity-50`}
                        >
                          {project.priority}优先级
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground line-clamp-2">{project.description}</div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member, index) => (
                          <div
                            key={index}
                            className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium border-2 border-background"
                          >
                            {member.charAt(0)}
                          </div>
                        ))}
                        {project.team.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium border-2 border-background">
                            +{project.team.length - 3}
                          </div>
                        )}
                      </div>

                      <Button variant="ghost" size="sm" onClick={() => setSelectedProject(project)}>
                        查看详情
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 数据概览视图 */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">项目状态分布</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      status: {
                        label: "项目状态",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">部门项目分布</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      department: {
                        label: "部门项目",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {departmentChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">项目完成情况</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      progress: {
                        label: "已完成",
                        color: "hsl(var(--chart-3))",
                      },
                      remaining: {
                        label: "未完成",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={progressChartData.slice(0, 5)}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis type="category" dataKey="name" width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="progress" stackId="a" fill="#82ca9d" name="已完成" />
                        <Bar dataKey="remaining" stackId="a" fill="#ffc658" name="未完成" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">项目进度概览</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    progress: {
                      label: "完成进度",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projects} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="progress" fill="#8884d8" name="完成进度">
                        {projects.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.progress < 30 ? "#ff8042" : entry.progress < 70 ? "#ffc658" : "#82ca9d"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 时间线视图 */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>项目里程碑时间线</CardTitle>
              <CardDescription>显示所有项目的关键里程碑和截止日期</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-9 top-0 bottom-0 w-px bg-muted-foreground/20" />

                {timelineData.map((item, index) => (
                  <div key={index} className="mb-8 flex gap-4">
                    <div
                      className={`relative mt-1 flex h-8 w-8 items-center justify-center rounded-full border ${
                        item.progress === 100
                          ? "bg-green-500 border-green-600"
                          : item.progress > 0
                            ? "bg-blue-500 border-blue-600"
                            : "bg-muted border-muted-foreground/20"
                      } text-white`}
                    >
                      {item.progress === 100 ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span className="text-xs">{item.progress}%</span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.milestone}</h3>
                        <Badge variant="outline">{item.project}</Badge>
                      </div>
                      <time className="text-sm text-muted-foreground">截止日期: {item.dueDate}</time>
                      <p className="text-sm mt-1">
                        {item.progress === 100 ? "已完成" : item.progress > 0 ? `进行中 (${item.progress}%)` : "未开始"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 风险管理视图 */}
        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>项目风险管理</CardTitle>
              <CardDescription>跟踪和管理所有项目的潜在风险</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map(
                  (project) =>
                    project.risks &&
                    project.risks.length > 0 && (
                      <div key={project.id} className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          {project.name}
                          <Badge className={`${statusColors[project.status]} text-white`}>{project.status}</Badge>
                        </h3>

                        <div className="rounded-md border">
                          <div className="grid grid-cols-12 bg-muted px-4 py-2 text-sm font-medium">
                            <div className="col-span-5">风险描述</div>
                            <div className="col-span-2">风险等级</div>
                            <div className="col-span-5">缓解措施</div>
                          </div>

                          {project.risks.map((risk, index) => (
                            <div key={index} className="grid grid-cols-12 px-4 py-3 text-sm border-t">
                              <div className="col-span-5 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                                {risk.description}
                              </div>
                              <div className="col-span-2">
                                <Badge
                                  className={`
                                  ${
                                    risk.level === "高"
                                      ? "bg-red-500"
                                      : risk.level === "中"
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                  } text-white
                                `}
                                >
                                  {risk.level}
                                </Badge>
                              </div>
                              <div className="col-span-5">{risk.mitigation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 项目详情对话框 */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                {selectedProject.name}
                <Badge className={`${statusColors[selectedProject.status]} text-white`}>{selectedProject.status}</Badge>
              </DialogTitle>
              <DialogDescription>{selectedProject.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">部门</p>
                  <p className="font-medium">{selectedProject.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">负责人</p>
                  <p className="font-medium">{selectedProject.manager}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">优先级</p>
                  <p className="font-medium flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`border-2 ${priorityColors[selectedProject.priority]} border-opacity-50`}
                    >
                      {selectedProject.priority}
                    </Badge>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">开始日期</p>
                  <p className="font-medium">{selectedProject.startDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">结束日期</p>
                  <p className="font-medium">{selectedProject.endDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">完成进度</p>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedProject.progress} className="h-2 flex-1" />
                    <span className="font-medium text-sm">{selectedProject.progress}%</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">项目团队</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                        {member.charAt(0)}
                      </div>
                      <span className="text-sm">{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">里程碑</h3>
                <div className="space-y-3">
                  {selectedProject.milestones.map((milestone, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{milestone.name}</span>
                          {milestone.progress === 100 && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              已完成
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">截止日期: {milestone.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={milestone.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{milestone.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">项目更新</h3>

                <div className="flex gap-2 mb-4">
                  <Textarea
                    placeholder="添加项目更新..."
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addProjectUpdate}>添加</Button>
                </div>

                <div className="space-y-3">
                  {selectedProject.updates.map((update, index) => (
                    <div key={index} className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{update.author}</span>
                        <span className="text-sm text-muted-foreground">{update.date}</span>
                      </div>
                      <p className="text-sm">{update.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProject.risks && selectedProject.risks.length > 0 && (
                <>
                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">风险管理</h3>
                    <div className="space-y-3">
                      {selectedProject.risks.map((risk, index) => (
                        <div key={index} className="bg-muted p-3 rounded-md">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{risk.description}</span>
                            <Badge
                              className={`
                                ${
                                  risk.level === "高"
                                    ? "bg-red-500"
                                    : risk.level === "中"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                } text-white
                              `}
                            >
                              {risk.level}风险
                            </Badge>
                          </div>
                          <p className="text-sm">
                            <span className="font-medium">缓解措施: </span>
                            {risk.mitigation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedProject(null)}>
                关闭
              </Button>
              <Button
                onClick={() => {
                  setEditingProject(selectedProject)
                  setIsEditDialogOpen(true)
                  setSelectedProject(null)
                }}
              >
                编辑项目
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 编辑项目对话框 */}
      {editingProject && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>编辑项目</DialogTitle>
              <DialogDescription>更新项目信息和进度</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <h3 className="font-medium">项目进度</h3>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={editingProject.progress}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        progress: Number.parseInt(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                  <span className="font-medium w-12 text-center">{editingProject.progress}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">项目状态</h3>
                <Select
                  value={editingProject.status}
                  onValueChange={(value) =>
                    setEditingProject({
                      ...editingProject,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="进行中">进行中</SelectItem>
                    <SelectItem value="即将完成">即将完成</SelectItem>
                    <SelectItem value="延期">延期</SelectItem>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="未开始">未开始</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">优先级</h3>
                <Select
                  value={editingProject.priority}
                  onValueChange={(value) =>
                    setEditingProject({
                      ...editingProject,
                      priority: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="高">高</SelectItem>
                    <SelectItem value="中">中</SelectItem>
                    <SelectItem value="低">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">开始日期</h3>
                  <Input
                    type="date"
                    value={editingProject.startDate}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">结束日期</h3>
                  <Input
                    type="date"
                    value={editingProject.endDate}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">项目描述</h3>
                <Textarea
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                取消
              </Button>
              <Button
                onClick={() => {
                  const updatedProjects = projects.map((project) =>
                    project.id === editingProject.id ? editingProject : project,
                  )
                  setProjects(updatedProjects)
                  setIsEditDialogOpen(false)
                }}
              >
                保存更改
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
