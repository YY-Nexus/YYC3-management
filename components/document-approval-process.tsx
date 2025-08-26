"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  MessageSquare,
  Paperclip,
  AlertTriangle,
  Eye,
  Download,
  Forward,
  UserPlus,
} from "lucide-react"

interface DocumentApprovalProcessProps {
  documentId: string
  documentTitle: string
  documentType: string
  approvalId: string
  onClose: () => void
  onSuccess: () => void
}

type ApprovalStatus = "pending" | "approved" | "rejected" | "canceled"

interface ApprovalHistory {
  id: string
  action: string
  user: string
  department: string
  time: string
  comment: string
}

interface ApprovalAttachment {
  id: string
  name: string
  size: string
  type: string
  uploadedBy: string
  uploadedAt: string
}

interface ApprovalComment {
  id: string
  user: string
  department: string
  avatar: string
  time: string
  content: string
}

export function DocumentApprovalProcess({
  documentId,
  documentTitle,
  documentType,
  approvalId,
  onClose,
  onSuccess,
}: DocumentApprovalProcessProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [comment, setComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("pending")
  const { toast } = useToast()

  // 模拟审批信息
  const approvalInfo = {
    id: approvalId,
    title: documentTitle,
    type: documentType,
    status: approvalStatus,
    submittedBy: "张三",
    submittedAt: "2023-07-15 10:30",
    urgency: "高",
    dueDate: "2023-07-20",
    currentApprover: "李经理",
    approvalFlow: "标准文档审批流程",
    description: "请审批此文档，内容已经过初步审核。",
  }

  // 模拟审批历史
  const approvalHistory: ApprovalHistory[] = [
    {
      id: "history-1",
      action: "提交审批",
      user: "张三",
      department: "市场部",
      time: "2023-07-15 10:30",
      comment: "提交文档审批",
    },
    {
      id: "history-2",
      action: "审批流转",
      user: "系统",
      department: "",
      time: "2023-07-15 10:30",
      comment: "流转至李经理进行审批",
    },
  ]

  // 模拟审批附件
  const approvalAttachments: ApprovalAttachment[] = [
    {
      id: "attachment-1",
      name: "文档说明.docx",
      size: "1.2 MB",
      type: "docx",
      uploadedBy: "张三",
      uploadedAt: "2023-07-15 10:30",
    },
    {
      id: "attachment-2",
      name: "补充材料.pdf",
      size: "2.5 MB",
      type: "pdf",
      uploadedBy: "张三",
      uploadedAt: "2023-07-15 10:35",
    },
  ]

  // 模拟审批评论
  const approvalComments: ApprovalComment[] = [
    {
      id: "comment-1",
      user: "张三",
      department: "市场部",
      avatar: "",
      time: "2023-07-15 10:40",
      content: "请尽快审批，谢谢！",
    },
    {
      id: "comment-2",
      user: "李经理",
      department: "技术部",
      avatar: "",
      time: "2023-07-15 11:15",
      content: "已查看文档，有几处需要修改的地方。",
    },
  ]

  // 处理审批
  const handleApproval = (status: ApprovalStatus) => {
    if (status === "approved" || status === "rejected") {
      if (!comment.trim()) {
        toast({
          title: "操作失败",
          description: `请填写${status === "approved" ? "审批" : "拒绝"}意见`,
          variant: "destructive",
        })
        return
      }
    }

    setIsProcessing(true)

    // 模拟处理审批
    setTimeout(() => {
      setIsProcessing(false)
      setApprovalStatus(status)

      // 添加审批历史
      const actionText = status === "approved" ? "审批通过" : status === "rejected" ? "审批拒绝" : "取消审批"

      toast({
        title: "操作成功",
        description: `文档已${actionText}`,
      })

      if (status === "approved" || status === "rejected") {
        onSuccess()
      }
    }, 1500)
  }

  // 添加评论
  const handleAddComment = () => {
    if (!comment.trim()) return

    // 模拟添加评论
    setTimeout(() => {
      setComment("")
      toast({
        title: "评论已添加",
        description: "您的评论已成功添加",
      })
    }, 500)
  }

  // 获取状态标签
  const getStatusBadge = (status: ApprovalStatus) => {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getStatusBadge(approvalStatus)}
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {approvalInfo.urgency}
              </Badge>
            </div>
            <CardTitle className="text-xl">{approvalInfo.title}</CardTitle>
            <CardDescription className="mt-1">
              <span className="font-medium">{approvalInfo.type}</span> ·
              <span className="ml-1">审批编号: {approvalInfo.id}</span>
            </CardDescription>
          </div>

          {approvalStatus === "pending" && (
            <div className="flex gap-2">
              <Button onClick={() => handleApproval("approved")} className="gap-1" disabled={isProcessing}>
                <CheckCircle size={16} />
                批准
              </Button>
              <Button
                onClick={() => handleApproval("rejected")}
                variant="destructive"
                className="gap-1"
                disabled={isProcessing}
              >
                <XCircle size={16} />
                拒绝
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="details" className="flex items-center gap-1">
                  <FileText size={16} />
                  详情
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  评论 ({approvalComments.length})
                </TabsTrigger>
                <TabsTrigger value="attachments" className="flex items-center gap-1">
                  <Paperclip size={16} />
                  附件 ({approvalAttachments.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-1">
                  <Clock size={16} />
                  历史
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">审批说明</h3>
                    <div className="p-4 border rounded-md bg-muted/10">
                      <p>{approvalInfo.description}</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="text-sm font-medium mb-3">文档预览</h3>
                    <div className="flex justify-center items-center h-[300px] bg-muted/20 rounded-md">
                      <div className="text-center">
                        <FileText size={48} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">文档预览</p>
                        <div className="flex justify-center mt-4 gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye size={14} />
                            查看文档
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download size={14} />
                            下载文档
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {approvalStatus === "pending" && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">审批意见</h3>
                      <Textarea
                        placeholder="请输入您的审批意见..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end mt-2 gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Forward size={14} />
                          转交他人
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <UserPlus size={14} />
                          加签
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="comments">
                <div className="space-y-4">
                  {approvalComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-3 border rounded-md">
                      <Avatar>
                        <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <span className="font-medium">{comment.user}</span>
                            {comment.department && (
                              <span className="text-xs text-muted-foreground ml-2">{comment.department}</span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{comment.time}</span>
                        </div>
                        <p>{comment.content}</p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4">
                    <Textarea
                      placeholder="添加评论..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button onClick={handleAddComment} disabled={!comment.trim()}>
                        发表评论
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attachments">
                <div className="space-y-4">
                  {approvalAttachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="mr-2">{attachment.size}</span>
                            <span>上传于 {attachment.uploadedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          预览
                        </Button>
                        <Button variant="outline" size="sm">
                          下载
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="space-y-4">
                  {approvalHistory.map((history, index) => (
                    <div key={history.id} className="relative pl-6">
                      {index !== approvalHistory.length - 1 && (
                        <div className="absolute left-2.5 top-3 w-px h-full bg-muted-foreground/20"></div>
                      )}
                      <div className="absolute left-0 top-2 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                        <span className="font-medium">{history.action}</span>
                        <span className="text-xs text-muted-foreground">{history.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <User size={14} />
                        <span>{history.user}</span>
                        {history.department && <span className="ml-1">({history.department})</span>}
                      </div>
                      <p className="text-sm">{history.comment}</p>
                    </div>
                  ))}

                  {approvalStatus === "approved" && (
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-2 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle size={14} className="text-green-600" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                        <span className="font-medium">审批通过</span>
                        <span className="text-xs text-muted-foreground">2023-07-15 14:30</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <User size={14} />
                        <span>李经理 (技术部)</span>
                      </div>
                      <p className="text-sm">{comment}</p>
                    </div>
                  )}

                  {approvalStatus === "rejected" && (
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-2 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle size={14} className="text-red-600" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                        <span className="font-medium">审批拒绝</span>
                        <span className="text-xs text-muted-foreground">2023-07-15 14:30</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <User size={14} />
                        <span>李经理 (技术部)</span>
                      </div>
                      <p className="text-sm">{comment}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">审批信息</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">提交人</p>
                      <p>{approvalInfo.submittedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">提交时间</p>
                      <p>{approvalInfo.submittedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">截止日期</p>
                      <p>{approvalInfo.dueDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">审批流程</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 border border-green-300 flex items-center justify-center text-xs">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">张三</p>
                      <p className="text-xs text-muted-foreground">提交人</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                        approvalStatus === "pending"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                          : approvalStatus === "approved"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                      }`}
                    >
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">李经理</p>
                      <p className="text-xs text-muted-foreground">
                        {approvalStatus === "pending"
                          ? "当前审批人"
                          : approvalStatus === "approved"
                            ? "已批准"
                            : "已拒绝"}
                      </p>
                    </div>
                  </div>
                  {approvalStatus === "approved" && (
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-gray-100 text-gray-700 border border-gray-300 flex items-center justify-center text-xs">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">王总监</p>
                        <p className="text-xs text-muted-foreground">待审批</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">相关文档</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-md hover:bg-muted/10 cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate">项目计划书</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        已批准
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">2023-07-10</p>
                  </div>
                  <div className="p-3 border rounded-md hover:bg-muted/10 cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate">市场调研报告</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        已批准
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">2023-07-05</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          返回
        </Button>
        {approvalStatus === "pending" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => handleApproval("canceled")}
              disabled={isProcessing}
            >
              <AlertTriangle size={16} />
              撤回
            </Button>
            <Button onClick={() => handleApproval("approved")} className="gap-1" disabled={isProcessing}>
              <CheckCircle size={16} />
              批准
            </Button>
            <Button
              onClick={() => handleApproval("rejected")}
              variant="destructive"
              className="gap-1"
              disabled={isProcessing}
            >
              <XCircle size={16} />
              拒绝
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
