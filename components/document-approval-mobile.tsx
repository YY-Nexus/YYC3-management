"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ApprovalItem = {
  id: string
  documentId: string
  documentTitle: string
  documentType: string
  status: "pending" | "approved" | "rejected" | "canceled"
  submittedBy: string
  submittedAt: string
  urgency: "low" | "normal" | "high" | "urgent"
  dueDate: string
  description: string
  overdue?: boolean
}

export function DocumentApprovalMobile() {
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null)
  const [comment, setComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterUrgency, setFilterUrgency] = useState("all")
  const { toast } = useToast()

  // 模拟审批数据
  const approvals: ApprovalItem[] = [
    {
      id: "approval-1",
      documentId: "doc-1",
      documentTitle: "2023年第三季度财务报告",
      documentType: "财务报告",
      status: "pending",
      submittedBy: "张财务",
      submittedAt: "2023-10-10",
      urgency: "high",
      dueDate: "2023-10-15",
      description: "请审核第三季度财务报告，重点关注收入增长和成本控制部分。",
    },
    {
      id: "approval-2",
      documentId: "doc-2",
      documentTitle: "市场推广计划",
      documentType: "营销文档",
      status: "pending",
      submittedBy: "王市场",
      submittedAt: "2023-10-09",
      urgency: "normal",
      dueDate: "2023-10-16",
      description: "下个月市场推广活动计划，包含预算和执行方案。",
    },
    {
      id: "approval-3",
      documentId: "doc-3",
      documentTitle: "产品发布策略",
      documentType: "产品文档",
      status: "pending",
      submittedBy: "李产品",
      submittedAt: "2023-10-08",
      urgency: "urgent",
      dueDate: "2023-10-12",
      description: "新产品发布策略和时间表，需要尽快审批以便安排后续工作。",
      overdue: true,
    },
    {
      id: "approval-4",
      documentId: "doc-4",
      documentTitle: "人力资源规划",
      documentType: "人事文档",
      status: "approved",
      submittedBy: "赵人事",
      submittedAt: "2023-10-07",
      urgency: "low",
      dueDate: "2023-10-20",
      description: "下一季度人力资源配置和招聘计划。",
    },
    {
      id: "approval-5",
      documentId: "doc-5",
      documentTitle: "技术研发报告",
      documentType: "技术文档",
      status: "rejected",
      submittedBy: "钱技术",
      submittedAt: "2023-10-06",
      urgency: "high",
      dueDate: "2023-10-13",
      description: "技术团队研发进展报告，包含项目进度和技术难点。",
    },
  ]

  // 筛选审批
  const filteredApprovals = approvals.filter((item) => {
    // 搜索筛选
    if (
      searchQuery &&
      !item.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.documentType.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // 状态筛选
    if (filterStatus !== "all" && item.status !== filterStatus) {
      return false
    }

    // 紧急程度筛选
    if (filterUrgency !== "all" && item.urgency !== filterUrgency) {
      return false
    }

    // 标签页筛选
    if (activeTab === "pending" && item.status !== "pending") {
      return false
    } else if (activeTab === "processed" && item.status === "pending") {
      return false
    }

    return true
  })

  // 处理审批
  const handleApproval = (action: "approve" | "reject") => {
    if (!selectedApproval) return

    if (action === "reject" && !comment.trim()) {
      toast({
        title: "请填写拒绝理由",
        description: "拒绝审批时需要填写拒绝理由",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // 模拟处理审批
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: `审批${action === "approve" ? "通过" : "拒绝"}`,
        description: `文档《${selectedApproval.documentTitle}》已${action === "approve" ? "批准" : "拒绝"}`,
      })
      setSelectedApproval(null)
      setComment("")
    }, 1000)
  }

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">移动审批</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter size={18} />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[50vh]">
            <SheetHeader>
              <SheetTitle>筛选审批</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">搜索</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="搜索审批..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">状态</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待审批</SelectItem>
                    <SelectItem value="approved">已批准</SelectItem>
                    <SelectItem value="rejected">已拒绝</SelectItem>
                    <SelectItem value="canceled">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">紧急程度</label>
                <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择紧急程度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="normal">普通</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-2">应用筛选</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock size={16} />
            待审批
          </TabsTrigger>
          <TabsTrigger value="processed" className="flex items-center gap-1">
            <CheckCircle size={16} />
            已处理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3">
          {filteredApprovals.length > 0 ? (
            filteredApprovals.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(item.status)}
                      {getUrgencyBadge(item.urgency)}
                      {item.overdue && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <AlertTriangle size={12} className="mr-1" />
                          已逾期
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedApproval(item)}>查看详情</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleApproval("approve")}>批准</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleApproval("reject")}>拒绝</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium line-clamp-1">{item.documentTitle}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {item.documentType}
                        </Badge>
                        <User size={12} className="mr-1" />
                        <span className="mr-2">{item.submittedBy}</span>
                        <Calendar size={12} className="mr-1" />
                        <span>{item.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between">
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedApproval(item)}>
                    查看详情
                  </Button>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setSelectedApproval(item)
                        setComment("不批准，需要修改")
                      }}
                    >
                      <XCircle size={14} className="mr-1" />
                      拒绝
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setSelectedApproval(item)
                        handleApproval("approve")
                      }}
                    >
                      <CheckCircle size={14} className="mr-1" />
                      批准
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">没有待处理的审批</h3>
              <p className="text-muted-foreground">所有审批已处理完毕</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-3">
          {filteredApprovals.length > 0 ? (
            filteredApprovals.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(item.status)}
                      {getUrgencyBadge(item.urgency)}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedApproval(item)}>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium line-clamp-1">{item.documentTitle}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {item.documentType}
                        </Badge>
                        <User size={12} className="mr-1" />
                        <span className="mr-2">{item.submittedBy}</span>
                        <Calendar size={12} className="mr-1" />
                        <span>{item.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">没有找到审批记录</h3>
              <p className="text-muted-foreground">尝试调整筛选条件或搜索关键词</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 审批详情抽屉 */}
      {selectedApproval && (
        <Sheet open={!!selectedApproval} onOpenChange={(open) => !open && setSelectedApproval(null)}>
          <SheetContent side="bottom" className="h-[90vh] sm:max-w-full">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={() => setSelectedApproval(null)}>
                  <ChevronLeft size={18} />
                </Button>
                <h2 className="text-lg font-semibold">审批详情</h2>
                <div className="w-9"></div> {/* 占位，保持标题居中 */}
              </div>

              <div className="flex-1 overflow-auto">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(selectedApproval.status)}
                    {getUrgencyBadge(selectedApproval.urgency)}
                    {selectedApproval.overdue && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <AlertTriangle size={12} className="mr-1" />
                        已逾期
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedApproval.documentTitle}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="mr-2">
                          {selectedApproval.documentType}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">提交人</p>
                      <p className="font-medium">{selectedApproval.submittedBy}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">提交时间</p>
                      <p className="font-medium">{selectedApproval.submittedAt}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">截止日期</p>
                      <p className={`font-medium ${selectedApproval.overdue ? "text-red-500" : ""}`}>
                        {selectedApproval.dueDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">文档ID</p>
                      <p className="font-medium">{selectedApproval.documentId}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">审批说明</p>
                    <div className="p-3 border rounded-md bg-muted/10">
                      <p>{selectedApproval.description}</p>
                    </div>
                  </div>

                  <div className="p-3 border rounded-md">
                    <h3 className="text-sm font-medium mb-3">文档预览</h3>
                    <div className="flex justify-center items-center h-[200px] bg-muted/20 rounded-md">
                      <div className="text-center">
                        <FileText size={40} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">文档预览</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          查看文档
                        </Button>
                      </div>
                    </div>
                  </div>

                  {selectedApproval.status === "pending" && (
                    <div>
                      <p className="text-muted-foreground mb-1">审批意见</p>
                      <Textarea
                        placeholder="请输入您的审批意见..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </div>

              {selectedApproval.status === "pending" && (
                <div className="pt-4 flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleApproval("reject")}
                    disabled={isProcessing}
                  >
                    <XCircle size={16} className="mr-1" />
                    拒绝
                  </Button>
                  <Button className="flex-1" onClick={() => handleApproval("approve")} disabled={isProcessing}>
                    <CheckCircle size={16} className="mr-1" />
                    批准
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
