"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Sidebar } from "@/components/sidebar"
import { DocumentVersionHistory } from "@/components/document-version-history"
import { DocumentComments } from "@/components/document-comments"
import { DocumentPermissions } from "@/components/document-permissions"
import { DocumentTags } from "@/components/document-tags"
import {
  ArrowLeft,
  Download,
  Edit,
  Share2,
  Star,
  Trash2,
  Clock,
  FileText,
  Calendar,
  Lock,
  PrinterIcon as Print,
  Copy,
  ExternalLink,
  MoreVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Document = {
  id: string
  title: string
  content: string
  type: string
  category: string
  size: string
  createdAt: string
  updatedAt: string
  author: string
  authorAvatar: string
  status: "draft" | "published" | "archived"
  isStarred: boolean
  isPrivate: boolean
  tags: string[]
  viewCount: number
  downloadCount: number
  version: string
  description?: string
}

export default function DocumentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("content")

  // 模拟文档数据
  useEffect(() => {
    const mockDocument: Document = {
      id: params.id as string,
      title: "2023年第三季度财务报告",
      content: `# 2023年第三季度财务报告

## 执行摘要

本季度公司实现了稳健的财务表现，营收同比增长15%，净利润增长12%。

## 主要财务指标

### 营收情况
- 总营收：¥2,450万元
- 同比增长：15%
- 环比增长：8%

### 利润情况
- 毛利润：¥1,470万元
- 净利润：¥490万元
- 利润率：20%

### 现金流情况
- 经营性现金流：¥520万元
- 投资性现金流：-¥180万元
- 筹资性现金流：¥50万元

## 业务分析

### 主营业务
公司主营业务保持稳定增长，其中：
- 产品销售收入占比65%
- 服务收入占比35%

### 市场表现
- 新客户获取：120家
- 客户留存率：92%
- 平均客单价：¥8,500

## 风险与机遇

### 主要风险
1. 市场竞争加剧
2. 原材料成本上升
3. 汇率波动影响

### 发展机遇
1. 新产品线推出
2. 海外市场拓展
3. 数字化转型加速

## 下季度展望

预计下季度将继续保持稳健增长，目标营收增长10-15%。

---

*本报告由财务部编制，数据截至2023年9月30日*`,
      type: "pdf",
      category: "财务报告",
      size: "2.4 MB",
      createdAt: "2023-10-01 09:30",
      updatedAt: "2023-10-15 14:20",
      author: "张财务",
      authorAvatar: "",
      status: "published",
      isStarred: true,
      isPrivate: false,
      tags: ["财务", "季度报告", "2023Q3"],
      viewCount: 156,
      downloadCount: 23,
      version: "v2.1",
      description: "2023年第三季度公司财务状况详细分析报告，包含营收、利润、现金流等关键指标。",
    }

    setTimeout(() => {
      setDocument(mockDocument)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleStarToggle = () => {
    if (document) {
      setDocument({ ...document, isStarred: !document.isStarred })
      toast({
        title: document.isStarred ? "已取消收藏" : "已添加收藏",
        description: document.isStarred ? "文档已从收藏中移除" : "文档已添加到收藏",
      })
    }
  }

  const handleDownload = () => {
    toast({
      title: "下载开始",
      description: "文档正在下载中...",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "链接已复制",
      description: "文档分享链接已复制到剪贴板",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">草稿</Badge>
      case "published":
        return <Badge className="bg-green-100 text-green-800">已发布</Badge>
      case "archived":
        return <Badge variant="secondary">已归档</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="text-center py-10">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">文档未找到</h3>
            <p className="text-muted-foreground">请检查文档ID是否正确</p>
            <Button className="mt-4" onClick={() => router.back()}>
              返回
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft size={18} />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{document.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(document.status)}
                  <Badge variant="outline">v{document.version}</Badge>
                  {document.isPrivate && (
                    <Badge variant="outline" className="text-orange-600">
                      <Lock size={12} className="mr-1" />
                      私密
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleStarToggle}>
                <Star size={16} className={document.isStarred ? "fill-yellow-400 text-yellow-400" : ""} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Print size={16} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit size={16} className="mr-2" />
                    编辑文档
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy size={16} className="mr-2" />
                    复制文档
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink size={16} className="mr-2" />
                    在新窗口打开
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 size={16} className="mr-2" />
                    删除文档
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="content">文档内容</TabsTrigger>
                  <TabsTrigger value="versions">版本历史</TabsTrigger>
                  <TabsTrigger value="comments">评论</TabsTrigger>
                  <TabsTrigger value="permissions">权限设置</TabsTrigger>
                </TabsList>

                <TabsContent value="content">
                  <Card>
                    <CardContent className="p-6">
                      <div className="prose max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: document.content
                              .replace(/\n/g, "<br>")
                              .replace(/#{1,6}\s/g, "<h3>")
                              .replace(/<h3>/g, "<h3 class='text-lg font-semibold mt-4 mb-2'>"),
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="versions">
                  <DocumentVersionHistory documentId={document.id} />
                </TabsContent>

                <TabsContent value="comments">
                  <DocumentComments documentId={document.id} />
                </TabsContent>

                <TabsContent value="permissions">
                  <DocumentPermissions documentId={document.id} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">文档信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{document.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{document.author}</p>
                        <p className="text-xs text-muted-foreground">创建者</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">文件大小</span>
                        <span>{document.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">文档类型</span>
                        <span>{document.type.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">分类</span>
                        <span>{document.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">查看次数</span>
                        <span>{document.viewCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">下载次数</span>
                        <span>{document.downloadCount}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">创建时间</p>
                          <p>{document.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">更新时间</p>
                          <p>{document.updatedAt}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">标签</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DocumentTags documentId={document.id} tags={document.tags} />
                  </CardContent>
                </Card>

                {document.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">文档描述</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{document.description}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
