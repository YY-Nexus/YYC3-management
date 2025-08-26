"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Filter,
  Search,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ApprovalItem = {
  id: string
  documentId: string
  documentTitle: string
  documentType: string
  submittedBy: string
  submittedAt: string
  urgency: "low" | "normal" | "high" | "urgent"
  dueDate: string
  overdue?: boolean
}

export function DocumentApprovalBatch() {
  const [selectedTab, setSelectedTab] = useState("pending")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [comment, setComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterUrgency, setFilterUrgency] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [expandedSection, setExpandedSection] = useState<"filters" | "selected" | null>(null)
  const { toast } = useToast()

  // 模拟待审批数据
  const pendingApprovals: ApprovalItem[] = [
    {
      id: "approval-1",
      documentId: "doc-1",
      documentTitle: "2023年第三季度财务报告",
      documentType: "财务报告",
      submittedBy: "张财务",
      submittedAt: "2023-10-10",
      urgency: "high",
      dueDate: "2023-10-15",
    },
    {
      id: "approval-2",
      documentId: "doc-2",
      documentTitle: "市场推广计划",
      documentType: "营销文档",
      submittedBy: "王市场",
      submittedAt: "2023-10-09",
      urgency: "normal",
      dueDate: "2023-10-16",
    },
    {
      id: "approval-3",
      documentId: "doc-3",
      documentTitle: "产品发布策略",
      documentType: "产品文档",
      submittedBy: "李产品",
      submittedAt: "2023-10-08",
      urgency: "urgent",
      dueDate: "2023-10-12",
      overdue: true,
    },
    {
      id: "approval-4",
      documentId: "doc-4",
      documentTitle: "人力资源规划",
      documentType: "人事文档",
      submittedBy: "赵人事",
      submittedAt: "2023-10-07",
      urgency: "low",
      dueDate: "2023-10-20",
    },
    {
      id: "approval-5",
      documentId: "doc-5",
      documentTitle: "技术研发报告",
      documentType: "技术文档",
      submittedBy: "钱技术",
      submittedAt: "2023-10-06",
      urgency: "high",
      dueDate: "2023-10-13",
      overdue: true,
    },
  ]

  // 筛选和排序审批项
  const filteredApprovals = pendingApprovals
    .filter((item) => {
      // 搜索筛选
      if (
        searchQuery &&
        !item.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.documentType.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // 紧急程度筛选
      if (filterUrgency !== "all" && item.urgency !== filterUrgency) {
        return false
      }

      // 日期筛选
      if (filterDate === "overdue" && !item.overdue) {
        return false
      } else if (filterDate === "today") {
        const today = new Date().toISOString().split("T")[0]
        if (item.dueDate !== today) return false
      } else if (filterDate === "tomorrow") {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowStr = tomorrow.toISOString().split("T")[0]
        if (item.dueDate !== tomorrowStr) return false
      } else if (filterDate === "this-week") {
        const today = new Date()
        const thisWeekEnd = new Date()
        thisWeekEnd.setDate(today.getDate() + (7 - today.getDay()))
        const dueDate = new Date(item.dueDate)
        if (dueDate > thisWeekEnd || dueDate < today) return false
      }

      return true
    })
    .sort((a, b) => {
      // 排序
      if (sortBy === "dueDate") {
        return sortDirection === "asc"
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      } else if (sortBy === "urgency") {
        const urgencyOrder = { urgent: 3, high: 2, normal: 1, low: 0 }
        return sortDirection === "asc"
          ? urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
          : urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
      } else if (sortBy === "submittedAt") {
        return sortDirection === "asc"
          ? new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
          : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      }
      return 0
    })

  // 选择所有项
  const selectAll = () => {
    if (selectedItems.length === filteredApprovals.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredApprovals.map((item) => item.id))
    }
  }

  // 切换选择状态
  const toggleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // 批量审批
  const handleBatchApproval = (action: "approve" | "reject") => {
    if (selectedItems.length === 0) {
      toast({
        title: "请选择审批项",
        description: "请至少选择一个审批项进行批量处理",
        variant: "destructive",
      })
      return
    }

    if (action === "reject" && !comment.trim()) {
      toast({
        title: "请填写拒绝理由",
        description: "批量拒绝时需要填写拒绝理由",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // 模拟批量审批处理
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: `批量${action === "approve" ? "批准" : "拒绝"}成功`,
        description: `已成功${action === "approve" ? "批准" : "拒绝"} ${selectedItems.length} 个审批项`,
      })
      setSelectedItems([])
      setComment("")
    }, 1500)
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

  // 切换排序方向
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  // 切换展开区域
  const toggleSection = (section: "filters" | "selected") => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">批量审批</h1>
          <p className="text-muted-foreground">高效处理多个审批请求</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock size={16} />
            待审批 ({pendingApprovals.length})
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <CardTitle>待审批文档</CardTitle>
              <div className="flex items-center gap-2">
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
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => toggleSection("filters")}
                >
                  <Filter size={14} />
                  筛选
                  {expandedSection === "filters" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => toggleSection("selected")}
                >
                  <CheckCircle size={14} />
                  已选 ({selectedItems.length})
                  {expandedSection === "selected" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </Button>
              </div>
            </div>
          </CardHeader>

          {expandedSection === "filters" && (
            <CardContent className="pb-3 pt-0 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">紧急程度</label>
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
                <div>
                  <label className="text-sm font-medium mb-1 block">截止日期</label>
                  <Select value={filterDate} onValueChange={setFilterDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择日期范围" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="overdue">已逾期</SelectItem>
                      <SelectItem value="today">今天</SelectItem>
                      <SelectItem value="tomorrow">明天</SelectItem>
                      <SelectItem value="this-week">本周</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">排序方式</label>
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择排序字段" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dueDate">截止日期</SelectItem>
                        <SelectItem value="urgency">紧急程度</SelectItem>
                        <SelectItem value="submittedAt">提交时间</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={toggleSortDirection}>
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {expandedSection === "selected" && selectedItems.length > 0 && (
            <CardContent className="pb-3 pt-0 border-b">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">批量审批意见</label>
                  <Textarea
                    placeholder="请输入审批意见..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="gap-1"
                    onClick={() => handleBatchApproval("reject")}
                    disabled={isProcessing}
                  >
                    <XCircle size={16} />
                    批量拒绝
                  </Button>
                  <Button className="gap-1" onClick={() => handleBatchApproval("approve")} disabled={isProcessing}>
                    <CheckCircle size={16} />
                    批量批准
                  </Button>
                </div>
              </div>
            </CardContent>
          )}

          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <Checkbox
                  id="select-all"
                  checked={selectedItems.length === filteredApprovals.length && filteredApprovals.length > 0}
                  onCheckedChange={selectAll}
                />
                <label htmlFor="select-all" className="ml-2 text-sm font-medium">
                  全选 ({filteredApprovals.length} 项)
                </label>
              </div>

              {filteredApprovals.length > 0 ? (
                <div className="space-y-2">
                  {filteredApprovals.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center p-3 border rounded-md transition-colors ${
                        selectedItems.includes(item.id) ? "bg-primary/5 border-primary/30" : "hover:bg-muted/10"
                      }`}
                    >
                      <Checkbox
                        id={`select-${item.id}`}
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleSelect(item.id)}
                        className="mr-3"
                      />
                      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText size={20} className="text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{item.documentTitle}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="outline">{item.documentType}</Badge>
                              {getUrgencyBadge(item.urgency)}
                              {item.overdue && (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  <AlertTriangle size={12} className="mr-1" />
                                  已逾期
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                          <div className="flex items-center text-sm">
                            <span className="text-muted-foreground mr-1">提交人:</span>
                            <span>{item.submittedBy}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar size={14} className="mr-1 text-muted-foreground" />
                            <span className={item.overdue ? "text-red-500 font-medium" : ""}>{item.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">没有找到审批项</h3>
                  <p className="text-muted-foreground">尝试调整筛选条件或搜索关键词</p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              已选择 {selectedItems.length} 项，共 {filteredApprovals.length} 项
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-1"
                onClick={() => handleBatchApproval("reject")}
                disabled={isProcessing || selectedItems.length === 0}
              >
                <XCircle size={16} />
                批量拒绝
              </Button>
              <Button
                className="gap-1"
                onClick={() => handleBatchApproval("approve")}
                disabled={isProcessing || selectedItems.length === 0}
              >
                <CheckCircle size={16} />
                批量批准
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  )
}
