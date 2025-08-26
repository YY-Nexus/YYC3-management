"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, XCircle, Clock, AlertCircle, Search, Calendar, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DocumentApprovalHistoryProps {
  onViewDetail: (id: string) => void
}

type ApprovalRecord = {
  id: string
  documentId: string
  documentTitle: string
  documentType: string
  status: "pending" | "approved" | "rejected" | "canceled" | "withdrawn"
  submittedBy: string
  submittedAt: string
  approvedBy?: string
  approvedAt?: string
  urgency: "low" | "normal" | "high" | "urgent"
  dueDate?: string
  currentStep?: string
  totalSteps?: number
  currentStepIndex?: number
}

export function DocumentApprovalHistory({ onViewDetail }: DocumentApprovalHistoryProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterUrgency, setFilterUrgency] = useState("all")
  const [filterDate, setFilterDate] = useState("all")

  // 模拟审批记录数据
  const approvalRecords: ApprovalRecord[] = [
    {
      id: "approval-1",
      documentId: "doc-1",
      documentTitle: "2023年第二季度财务报告",
      documentType: "财务报告",
      status: "approved",
      submittedBy: "张财务",
      submittedAt: "2023-07-10 09:30",
      approvedBy: "李经理",
      approvedAt: "2023-07-12 14:20",
      urgency: "normal",
      dueDate: "2023-07-15",
      totalSteps: 2,
      currentStepIndex: 2,
    },
    {
      id: "approval-2",
      documentId: "doc-2",
      documentTitle: "产品开发路线图",
      documentType: "产品文档",
      status: "pending",
      submittedBy: "李产品",
      submittedAt: "2023-07-12 11:45",
      urgency: "high",
      dueDate: "2023-07-18",
      currentStep: "总监审批",
      totalSteps: 3,
      currentStepIndex: 2,
    },
    {
      id: "approval-3",
      documentId: "doc-3",
      documentTitle: "市场营销策略",
      documentType: "营销文档",
      status: "rejected",
      submittedBy: "王市场",
      submittedAt: "2023-07-08 15:20",
      approvedBy: "赵总监",
      approvedAt: "2023-07-09 10:30",
      urgency: "urgent",
      dueDate: "2023-07-12",
      totalSteps: 2,
      currentStepIndex: 1,
    },
    {
      id: "approval-4",
      documentId: "doc-4",
      documentTitle: "员工手册2023版",
      documentType: "人事文档",
      status: "pending",
      submittedBy: "赵人事",
      submittedAt: "2023-07-14 09:15",
      urgency: "normal",
      dueDate: "2023-07-20",
      currentStep: "部门经理审批",
      totalSteps: 3,
      currentStepIndex: 1,
    },
    {
      id: "approval-5",
      documentId: "doc-5",
      documentTitle: "项目进度报告",
      documentType: "项目文档",
      status: "canceled",
      submittedBy: "孙项目",
      submittedAt: "2023-07-05 14:30",
      urgency: "low",
      totalSteps: 2,
      currentStepIndex: 0,
    },
  ]

  // 筛选审批记录
  const filteredRecords = approvalRecords.filter((record) => {
    // 状态筛选
    if (filterStatus !== "all" && record.status !== filterStatus) {
      return false
    }

    // 紧急程度筛选
    if (filterUrgency !== "all" && record.urgency !== filterUrgency) {
      return false
    }

    // 日期筛选
    if (filterDate !== "all") {
      const recordDate = new Date(record.submittedAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)
      const lastMonth = new Date(today)
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      if (
        (filterDate === "today" && recordDate.toDateString() !== today.toDateString()) ||
        (filterDate === "yesterday" && recordDate.toDateString() !== yesterday.toDateString()) ||
        (filterDate === "last-week" && (recordDate < lastWeek || recordDate > today)) ||
        (filterDate === "last-month" && (recordDate < lastMonth || recordDate > today))
      ) {
        return false
      }
    }

    // 搜索筛选
    if (
      searchQuery &&
      !record.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !record.documentType.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !record.submittedBy.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // 标签页筛选
    if (activeTab === "pending" && record.status !== "pending") {
      return false
    } else if (activeTab === "approved" && record.status !== "approved") {
      return false
    } else if (activeTab === "rejected" && record.status !== "rejected") {
      return false
    } else if (activeTab === "my-submitted" && record.submittedBy !== "当前用户") {
      return false
    } else if (activeTab === "my-approved" && record.approvedBy !== "当前用户") {
      return false
    }

    return true
  })

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            待审批
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            已批准
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            已拒绝
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            已取消
          </Badge>
        )
      case "withdrawn":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            已撤回
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 获取紧急程度标签
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            低
          </Badge>
        )
      case "normal":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            普通
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            高
          </Badge>
        )
      case "urgent":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            紧急
          </Badge>
        )
      default:
        return <Badge variant="outline">{urgency}</Badge>
    }
  }

  // 获取进度指示器
  const getProgressIndicator = (record: ApprovalRecord) => {
    if (!record.totalSteps || record.totalSteps === 0) return null

    const steps = Array(record.totalSteps).fill(0)
    const currentIndex = record.currentStepIndex || 0

    return (
      <div className="flex items-center gap-1">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full ${
              index < currentIndex
                ? "bg-green-500"
                : index === currentIndex && record.status === "pending"
                  ? "bg-yellow-500"
                  : index === currentIndex && record.status === "rejected"
                    ? "bg-red-500"
                    : "bg-gray-200"
            }`}
            style={{ width: `${100 / record.totalSteps!}%`, maxWidth: "30px" }}
          ></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">文档审批历史</h1>
          <p className="text-muted-foreground">查看和管理文档审批记录</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <FileText size={16} />
            <span className="hidden md:inline">全部</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock size={16} />
            <span className="hidden md:inline">待审批</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-1">
            <CheckCircle size={16} />
            <span className="hidden md:inline">已批准</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-1">
            <XCircle size={16} />
            <span className="hidden md:inline">已拒绝</span>
          </TabsTrigger>
          <TabsTrigger value="my-submitted" className="flex items-center gap-1">
            <User size={16} />
            <span className="hidden md:inline">我提交的</span>
          </TabsTrigger>
          <TabsTrigger value="my-approved" className="flex items-center gap-1">
            <CheckCircle size={16} />
            <span className="hidden md:inline">我审批的</span>
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <CardTitle>审批记录</CardTitle>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="搜索审批..."
                    className="pl-8 w-full md:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[130px]">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待审批</SelectItem>
                    <SelectItem value="approved">已批准</SelectItem>
                    <SelectItem value="rejected">已拒绝</SelectItem>
                    <SelectItem value="canceled">已取消</SelectItem>
                    <SelectItem value="withdrawn">已撤回</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                  <SelectTrigger className="w-full md:w-[130px]">
                    <SelectValue placeholder="紧急程度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部紧急程度</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                    <SelectItem value="normal">普通</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger className="w-full md:w-[130px]">
                    <SelectValue placeholder="日期" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部日期</SelectItem>
                    <SelectItem value="today">今天</SelectItem>
                    <SelectItem value="yesterday">昨天</SelectItem>
                    <SelectItem value="last-week">最近一周</SelectItem>
                    <SelectItem value="last-month">最近一个月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:bg-muted/10 cursor-pointer transition-colors"
                    onClick={() => onViewDetail(record.id)}
                  >
                    <div className="flex items-start gap-3 mb-3 md:mb-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{record.documentTitle}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="outline">{record.documentType}</Badge>
                          {getStatusBadge(record.status)}
                          {getUrgencyBadge(record.urgency)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-1">
                      <div className="flex items-center text-sm">
                        <User size={14} className="mr-1 text-muted-foreground" />
                        <span>{record.submittedBy}</span>
                        <span className="mx-1">·</span>
                        <Calendar size={14} className="mr-1 text-muted-foreground" />
                        <span>{record.submittedAt.split(" ")[0]}</span>
                      </div>
                      {record.status === "pending" && record.currentStep && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">{record.currentStep}</span>
                          {getProgressIndicator(record)}
                        </div>
                      )}
                      {record.status === "approved" && record.approvedAt && (
                        <div className="text-xs text-muted-foreground">
                          <CheckCircle size={12} className="inline mr-1 text-green-600" />
                          {record.approvedBy} 于 {record.approvedAt} 批准
                        </div>
                      )}
                      {record.status === "rejected" && record.approvedAt && (
                        <div className="text-xs text-muted-foreground">
                          <XCircle size={12} className="inline mr-1 text-red-600" />
                          {record.approvedBy} 于 {record.approvedAt} 拒绝
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">没有找到审批记录</h3>
                  <p className="text-muted-foreground">尝试调整筛选条件或搜索关键词</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
