"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ApprovalRequest } from "@/app/approval/page"
import {
  Calendar,
  FileText,
  MessageSquare,
  Paperclip,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CreditCard,
  ShoppingCart,
} from "lucide-react"

interface ApprovalDetailProps {
  requestId: string
  requests: ApprovalRequest[]
  updateStatus: (id: string, status: "approved" | "rejected" | "canceled") => void
}

export function ApprovalDetail({ requestId, requests, updateStatus }: ApprovalDetailProps) {
  const [comment, setComment] = useState("")
  const [activeTab, setActiveTab] = useState("details")

  // 查找当前审批请求
  const request = requests.find((r) => r.id === requestId)

  if (!request) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">未找到审批请求</h3>
            <p className="text-muted-foreground">该审批请求可能已被删除或不存在</p>
          </div>
        </CardContent>
      </Card>
    )
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
      case "draft":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            草稿
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 获取优先级标签
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            低
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            中
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
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  // 提交评论
  const submitComment = () => {
    if (comment.trim()) {
      // 这里应该有一个添加评论的逻辑
      setComment("")
    }
  }

  // 获取图标
  const getTypeIcon = () => {
    switch (request.type) {
      case "请假":
        return <Calendar className="h-6 w-6 text-blue-500" />
      case "报销":
        return <CreditCard className="h-6 w-6 text-green-500" />
      case "采购":
        return <ShoppingCart className="h-6 w-6 text-purple-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getTypeIcon()}
              <div>
                <CardTitle className="text-xl">{request.title}</CardTitle>
                <CardDescription className="mt-1">
                  <span className="mr-2">#{request.id}</span>
                  <span className="mr-2">{request.type}</span>
                  <span>{request.category}</span>
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {getStatusBadge(request.status)}
              {getPriorityBadge(request.priority)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid grid-cols-3 md:w-[400px]">
              <TabsTrigger value="details">详情</TabsTrigger>
              <TabsTrigger value="process">流程</TabsTrigger>
              <TabsTrigger value="comments">评论</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">提交人</h3>
                    <p className="mt-1">{request.submittedBy}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">提交时间</h3>
                    <p className="mt-1">{request.submittedAt}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">所属部门</h3>
                    <p className="mt-1">{request.department}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">当前审批人</h3>
                    <p className="mt-1">{request.currentApprover || "无"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">截止日期</h3>
                    <p className="mt-1">{request.dueDate || "无"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">附件</h3>
                    <p className="mt-1">{request.attachments ? `${request.attachments}个附件` : "无"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">申请内容</h3>
                <div className="p-4 border rounded-md bg-muted/30">
                  <p>{request.content}</p>
                </div>
              </div>

              {request.attachments && request.attachments > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">附件</h3>
                  <div className="space-y-2">
                    {Array(request.attachments)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center p-2 border rounded-md">
                          <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>附件 {i + 1}</span>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            查看
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="process" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">审批流程</h3>
                <div className="space-y-6">
                  {request.approvers.map((approver, index) => (
                    <div key={index} className="relative pl-6 pb-6">
                      <div className="absolute left-0 top-0 h-full w-px bg-border"></div>
                      <div
                        className={`absolute left-[-8px] top-0 h-4 w-4 rounded-full border-2 ${
                          index < request.approvers.indexOf(request.currentApprover) ||
                          (request.status === "approved" && index === request.approvers.length - 1)
                            ? "bg-green-500 border-green-500"
                            : index === request.approvers.indexOf(request.currentApprover)
                              ? "bg-yellow-500 border-yellow-500"
                              : "bg-muted border-muted-foreground"
                        }`}
                      ></div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{approver}</p>
                          <p className="text-sm text-muted-foreground">
                            {index === 0 ? "一级审批" : index === 1 ? "二级审批" : `${index + 1}级审批`}
                          </p>
                        </div>
                        <div>
                          {index < request.approvers.indexOf(request.currentApprover) ||
                          (request.status === "approved" && index === request.approvers.length - 1) ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              已批准
                            </Badge>
                          ) : index === request.approvers.indexOf(request.currentApprover) ? (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              审批中
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              等待中
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">评论记录</h3>
                {request.comments && request.comments > 0 ? (
                  <div className="space-y-4">
                    {Array(request.comments)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex gap-3 p-3 border rounded-md">
                          <Avatar>
                            <AvatarFallback>{i % 2 === 0 ? "ZS" : "LS"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{i % 2 === 0 ? "张三" : "李四"}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  new Date(request.submittedAt).getTime() - i * 24 * 60 * 60 * 1000,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="mt-1 text-sm">这是一条评论内容，用于测试评论功能。</p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>暂无评论</p>
                  </div>
                )}

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">添加评论</h3>
                  <Textarea
                    placeholder="请输入您的评论..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button onClick={submitComment} disabled={!comment.trim()}>
                      提交评论
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        {request.status === "pending" && (
          <CardFooter className="flex justify-end gap-2 pt-0">
            <Button variant="outline" onClick={() => updateStatus(request.id, "canceled")}>
              取消申请
            </Button>
            <Button variant="destructive" onClick={() => updateStatus(request.id, "rejected")}>
              <XCircle className="mr-2 h-4 w-4" />
              拒绝
            </Button>
            <Button onClick={() => updateStatus(request.id, "approved")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              批准
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
