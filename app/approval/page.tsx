"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText, CheckCircle, Clock, XCircle, BarChart3, Settings } from "lucide-react"
import { ApprovalStatistics } from "@/components/approval-statistics"
import { ApprovalDetail } from "@/components/approval-detail"
import { DocumentApprovalHistory } from "@/components/document-approval-history"
import { ApprovalProcessDesigner } from "@/components/approval-process-designer"

export interface ApprovalRequest {
  id: string
  type: string
  title: string
  submittedBy: string
  submittedAt: string
  status: string
  priority: string
  currentApprover: string
  comments?: number
  attachments?: number
  category: string
  department: string
  approvers: string[]
  content: string
  dueDate?: string
}

export default function ApprovalSystem() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)

  // 模拟审批请求数据
  const approvalRequests: ApprovalRequest[] = [
    {
      id: "REQ-001",
      type: "请假",
      title: "年假申请",
      submittedBy: "张三",
      submittedAt: "2023-07-15 10:30",
      status: "pending",
      priority: "medium",
      currentApprover: "李经理",
      comments: 2,
      category: "人事",
      department: "技术部",
      approvers: ["李经理", "王总监"],
      content: "申请年假3天，计划外出旅游。",
      dueDate: "2023-07-20",
    },
    {
      id: "REQ-002",
      type: "报销",
      title: "差旅费报销",
      submittedBy: "李四",
      submittedAt: "2023-07-14 14:20",
      status: "approved",
      priority: "high",
      currentApprover: "王总监",
      attachments: 3,
      category: "财务",
      department: "销售部",
      approvers: ["张经理", "王总监"],
      content: "出差上海3天，报销交通费和住宿费共计3500元。",
    },
    {
      id: "REQ-003",
      type: "采购",
      title: "办公设备采购",
      submittedBy: "王五",
      submittedAt: "2023-07-13 09:15",
      status: "rejected",
      priority: "urgent",
      currentApprover: "赵总监",
      comments: 1,
      attachments: 2,
      category: "行政",
      department: "行政部",
      approvers: ["赵总监", "钱总经理"],
      content: "采购10台笔记本电脑，预算80000元。",
    },
    {
      id: "REQ-004",
      type: "合同",
      title: "服务合同审批",
      submittedBy: "赵六",
      submittedAt: "2023-07-12 16:40",
      status: "pending",
      priority: "low",
      currentApprover: "钱总经理",
      category: "法务",
      department: "法务部",
      approvers: ["钱总经理", "孙董事长"],
      content: "与供应商A签订年度服务合同，合同金额50万元。",
      dueDate: "2023-07-25",
    },
    {
      id: "REQ-005",
      type: "加班",
      title: "周末加班申请",
      submittedBy: "钱七",
      submittedAt: "2023-07-11 11:30",
      status: "approved",
      priority: "medium",
      currentApprover: "孙经理",
      category: "人事",
      department: "产品部",
      approvers: ["孙经理"],
      content: "本周六需要加班完成产品发布前的最后测试工作。",
    },
  ]

  // 更新审批状态
  const updateApprovalStatus = (id: string, status: "approved" | "rejected" | "canceled") => {
    // 在实际应用中，这里应该调用API更新状态
    console.log(`更新审批 ${id} 状态为 ${status}`)

    // 更新后返回列表视图
    setSelectedRequestId(null)
  }

  // 查看审批详情
  const handleViewDetail = (id: string) => {
    setSelectedRequestId(id)
    setActiveTab("detail")
  }

  // 返回列表视图
  const handleBackToList = () => {
    setSelectedRequestId(null)
    setActiveTab("dashboard")
  }

  // 新建审批
  const handleNewApproval = () => {
    router.push("/approval/new")
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">审批中心</h1>
            <p className="text-muted-foreground">管理和处理各类审批请求</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="w-full md:w-auto" onClick={handleNewApproval}>
              <PlusCircle className="mr-2 h-4 w-4" />
              新建审批
            </Button>
            <Button variant="outline" className="w-full md:w-auto" onClick={() => router.push("/approval/templates")}>
              <Settings className="mr-2 h-4 w-4" />
              模板管理
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <BarChart3 size={16} />
              <span className="hidden md:inline">仪表盘</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-1">
              <Clock size={16} />
              <span className="hidden md:inline">待我审批</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <FileText size={16} />
              <span className="hidden md:inline">审批历史</span>
            </TabsTrigger>
            <TabsTrigger value="process" className="flex items-center gap-1">
              <CheckCircle size={16} />
              <span className="hidden md:inline">流程设计</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ApprovalStatistics />
          </TabsContent>

          <TabsContent value="pending">
            {selectedRequestId ? (
              <ApprovalDetail
                requestId={selectedRequestId}
                requests={approvalRequests}
                updateStatus={updateApprovalStatus}
              />
            ) : (
              <div className="space-y-4">
                {approvalRequests
                  .filter((req) => req.status === "pending")
                  .map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:bg-muted/10 cursor-pointer transition-colors"
                      onClick={() => handleViewDetail(request.id)}
                    >
                      <div className="flex items-start gap-3 mb-3 md:mb-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{request.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{request.type}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{request.submittedBy}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{request.submittedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateApprovalStatus(request.id, "approved")
                          }}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          批准
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateApprovalStatus(request.id, "rejected")
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          拒绝
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <DocumentApprovalHistory onViewDetail={handleViewDetail} />
          </TabsContent>

          <TabsContent value="process">
            <ApprovalProcessDesigner />
          </TabsContent>

          <TabsContent value="detail">
            {selectedRequestId && (
              <div className="space-y-4">
                <Button variant="outline" onClick={handleBackToList}>
                  返回列表
                </Button>
                <ApprovalDetail
                  requestId={selectedRequestId}
                  requests={approvalRequests}
                  updateStatus={updateApprovalStatus}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
