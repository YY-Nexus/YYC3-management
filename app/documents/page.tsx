"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { FileUploader } from "@/components/file-uploader"
import { DocumentList } from "@/components/document-list"
import { DocumentSearch } from "@/components/document-search"
import { DocumentCategories } from "@/components/document-categories"
import { DocumentApprovalSubmit } from "@/components/document-approval-submit"
import { DocumentApprovalProcess } from "@/components/document-approval-process"
import { DocumentApprovalHistory } from "@/components/document-approval-history"
import { DocumentApprovalConfig } from "@/components/document-approval-config"
import { DocumentApprovalBatch } from "@/components/document-approval-batch"
import { DocumentApprovalMobile } from "@/components/document-approval-mobile"
import { DocumentApprovalNotifications } from "@/components/document-approval-notifications"
import { DocumentApprovalAnalytics } from "@/components/document-approval-analytics"
import { DocumentApprovalRecommender } from "@/components/document-approval-recommender"
import { useToast } from "@/components/ui/use-toast"
import { Filter, Grid3X3, List, Upload, BarChart, Bell, UserCheck, Smartphone } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function DocumentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("general")
  const [addWatermark, setAddWatermark] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("browse")
  const [approvalActiveTab, setApprovalActiveTab] = useState("history")
  const [showApprovalSubmit, setShowApprovalSubmit] = useState(false)
  const [showApprovalProcess, setShowApprovalProcess] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string
    title: string
    type: string
  } | null>(null)
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null)
  const [unreadNotifications, setUnreadNotifications] = useState(3)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  useEffect(() => {
    // 模拟加载数据
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 模拟提交逻辑
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "文档已发布",
        description: "您的文档已成功发布并通知相关人员",
        duration: 3000,
      })
      // 重置表单
      setTitle("")
      setContent("")
      setAddWatermark(false)
      setIsPrivate(false)
    }, 1500)
  }

  // 处理提交审批
  const handleSubmitApproval = (documentId: string, documentTitle: string, documentType: string) => {
    setSelectedDocument({
      id: documentId,
      title: documentTitle,
      type: documentType,
    })
    setShowApprovalSubmit(true)
  }

  // 处理查看审批
  const handleViewApproval = (approvalId: string) => {
    setSelectedApproval(approvalId)
    setShowApprovalProcess(true)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 overflow-auto p-4 md:p-6 transition-all duration-300">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">文档中心</h1>
              <p className="text-muted-foreground">管理、创建和分享您的文档</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? "隐藏侧边栏" : "显示侧边栏"}
              </Button>
              <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List size={16} /> : <Grid3X3 size={16} />}
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="browse">浏览文档</TabsTrigger>
              <TabsTrigger value="upload">上传文档</TabsTrigger>
              <TabsTrigger value="create">创建通知</TabsTrigger>
              <TabsTrigger value="approval" className="relative">
                审批管理
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="config">审批配置</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <DocumentCategories />
                </div>
                <div className="md:col-span-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle>所有文档</CardTitle>
                        <DocumentSearch />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Filter size={14} className="mr-1" />
                          筛选
                        </Button>
                        <Select defaultValue="newest">
                          <SelectTrigger className="h-8 text-xs w-[120px]">
                            <SelectValue placeholder="排序方式" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">最新上传</SelectItem>
                            <SelectItem value="oldest">最早上传</SelectItem>
                            <SelectItem value="name">名称排序</SelectItem>
                            <SelectItem value="size">大小排序</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <DocumentList
                        viewMode={viewMode}
                        isLoading={isLoading}
                        onSubmitApproval={handleSubmitApproval}
                        onViewApproval={handleViewApproval}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>上传文档</CardTitle>
                  <CardDescription>上传文档并设置相关属性</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doc-title">文档标题</Label>
                      <Input id="doc-title" placeholder="请输入文档标题" />
                    </div>
                    <div>
                      <Label htmlFor="doc-category">文档分类</Label>
                      <Select defaultValue="general">
                        <SelectTrigger id="doc-category">
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">通用文档</SelectItem>
                          <SelectItem value="report">报告</SelectItem>
                          <SelectItem value="contract">合同</SelectItem>
                          <SelectItem value="policy">政策文件</SelectItem>
                          <SelectItem value="guide">指南手册</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="doc-description">文档描述</Label>
                    <Textarea id="doc-description" placeholder="请输入文档描述" rows={3} />
                  </div>

                  <FileUploader addWatermark={addWatermark} />

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="watermark" checked={addWatermark} onCheckedChange={setAddWatermark} />
                      <Label htmlFor="watermark">添加水印</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
                      <Label htmlFor="private">设为私密文档</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="need-approval" defaultChecked />
                      <Label htmlFor="need-approval">需要审批</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">取消</Button>
                  <Button>
                    <Upload size={16} className="mr-2" />
                    上传文档
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>创建工作通知</CardTitle>
                  <CardDescription>创建并发布工作通知给团队成员</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">通知标题</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="请输入通知标题"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">通知类型</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="选择通知类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">一般通知</SelectItem>
                          <SelectItem value="urgent">紧急通知</SelectItem>
                          <SelectItem value="meeting">会议通知</SelectItem>
                          <SelectItem value="event">活动通知</SelectItem>
                          <SelectItem value="policy">政策通知</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="content">通知内容</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="请输入通知内容"
                        rows={5}
                        required
                      />
                    </div>
                    <FileUploader addWatermark={addWatermark} />
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="notice-watermark" checked={addWatermark} onCheckedChange={setAddWatermark} />
                        <Label htmlFor="notice-watermark">添加水印</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="notice-private" checked={isPrivate} onCheckedChange={setIsPrivate} />
                        <Label htmlFor="notice-private">仅特定人员可见</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="notice-need-approval" defaultChecked />
                        <Label htmlFor="notice-need-approval">需要审批</Label>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">保存草稿</Button>
                  <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "发布中..." : "发布通知"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="approval">
              {isMobile ? (
                <DocumentApprovalMobile />
              ) : (
                <>
                  <Tabs value={approvalActiveTab} onValueChange={setApprovalActiveTab} className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="history" className="flex items-center gap-1">
                        <BarChart size={16} />
                        审批历史
                      </TabsTrigger>
                      <TabsTrigger value="batch" className="flex items-center gap-1">
                        <UserCheck size={16} />
                        批量审批
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="flex items-center gap-1 relative">
                        <Bell size={16} />
                        审批提醒
                        {unreadNotifications > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {unreadNotifications}
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="analytics" className="flex items-center gap-1">
                        <BarChart size={16} />
                        审批报表
                      </TabsTrigger>
                      <TabsTrigger value="recommender" className="flex items-center gap-1">
                        <UserCheck size={16} />
                        智能推荐
                      </TabsTrigger>
                      <TabsTrigger value="mobile" className="flex items-center gap-1">
                        <Smartphone size={16} />
                        移动审批
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="history">
                      <DocumentApprovalHistory onViewDetail={handleViewApproval} />
                    </TabsContent>

                    <TabsContent value="batch">
                      <DocumentApprovalBatch />
                    </TabsContent>

                    <TabsContent value="notifications">
                      <DocumentApprovalNotifications />
                    </TabsContent>

                    <TabsContent value="analytics">
                      <DocumentApprovalAnalytics />
                    </TabsContent>

                    <TabsContent value="recommender">
                      <DocumentApprovalRecommender />
                    </TabsContent>

                    <TabsContent value="mobile">
                      <div className="flex flex-col items-center justify-center p-6">
                        <div className="max-w-md w-full">
                          <div className="border-2 border-gray-300 rounded-3xl p-4 pb-8 bg-white shadow-lg">
                            <div className="w-full h-6 bg-gray-200 rounded-full mb-4 relative">
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gray-300 rounded-full"></div>
                            </div>
                            <DocumentApprovalMobile />
                          </div>
                          <div className="text-center mt-6">
                            <p className="text-muted-foreground">移动端审批界面预览</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              扫描二维码或在移动设备上访问系统，体验完整移动审批功能
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </TabsContent>

            <TabsContent value="config">
              <DocumentApprovalConfig />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 审批提交对话框 */}
      {showApprovalSubmit && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl">
            <DocumentApprovalSubmit
              documentId={selectedDocument.id}
              documentTitle={selectedDocument.title}
              documentType={selectedDocument.type}
              onClose={() => {
                setShowApprovalSubmit(false)
                setSelectedDocument(null)
              }}
              onSuccess={() => {
                setShowApprovalSubmit(false)
                setSelectedDocument(null)
                toast({
                  title: "审批已提交",
                  description: "文档审批已成功提交，请等待审批结果",
                  duration: 3000,
                })
              }}
            />
          </div>
        </div>
      )}

      {/* 审批处理对话框 */}
      {showApprovalProcess && selectedApproval && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl">
            <DocumentApprovalProcess
              documentId="doc-1"
              documentTitle="2023年第二季度财务报告"
              documentType="财务报告"
              approvalId={selectedApproval}
              onClose={() => {
                setShowApprovalProcess(false)
                setSelectedApproval(null)
              }}
              onSuccess={() => {
                setShowApprovalProcess(false)
                setSelectedApproval(null)
                toast({
                  title: "审批已处理",
                  description: "文档审批已成功处理",
                  duration: 3000,
                })
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
