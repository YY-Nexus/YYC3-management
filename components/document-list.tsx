"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  MoreVertical,
  Download,
  Trash,
  Share,
  Edit,
  Eye,
  Star,
  Clock,
  File,
  FileImage,
  FileIcon as FilePdf,
  FileArchive,
  FileSpreadsheet,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

type Document = {
  id: string
  title: string
  type: string
  size: string
  updatedAt: string
  author: string
  category: string
  isStarred: boolean
  approvalStatus?: "pending" | "approved" | "rejected" | null
  needsApproval?: boolean
}

type DocumentListProps = {
  viewMode: "grid" | "list"
  isLoading: boolean
  onSubmitApproval?: (documentId: string, documentTitle: string, documentType: string) => void
  onViewApproval?: (approvalId: string) => void
}

// 模拟文档数据
const mockDocuments: Document[] = [
  {
    id: "doc-1",
    title: "2023年第二季度财务报告",
    type: "pdf",
    size: "2.4 MB",
    updatedAt: "2023-07-15",
    author: "张财务",
    category: "财务报告",
    isStarred: true,
    approvalStatus: "approved",
    needsApproval: true,
  },
  {
    id: "doc-2",
    title: "产品开发路线图",
    type: "docx",
    size: "1.8 MB",
    updatedAt: "2023-07-10",
    author: "李产品",
    category: "产品文档",
    isStarred: false,
    approvalStatus: "pending",
    needsApproval: true,
  },
  {
    id: "doc-3",
    title: "市场营销策略",
    type: "pptx",
    size: "5.2 MB",
    updatedAt: "2023-07-05",
    author: "王市场",
    category: "营销文档",
    isStarred: true,
    approvalStatus: "rejected",
    needsApproval: true,
  },
  {
    id: "doc-4",
    title: "员工手册2023版",
    type: "pdf",
    size: "3.1 MB",
    updatedAt: "2023-06-28",
    author: "赵人事",
    category: "人事文档",
    isStarred: false,
    needsApproval: true,
  },
  {
    id: "doc-5",
    title: "项目进度报告",
    type: "xlsx",
    size: "1.5 MB",
    updatedAt: "2023-06-25",
    author: "孙项目",
    category: "项目文档",
    isStarred: false,
    needsApproval: false,
  },
  {
    id: "doc-6",
    title: "客户满意度调查结果",
    type: "pdf",
    size: "4.2 MB",
    updatedAt: "2023-06-20",
    author: "钱客服",
    category: "客户文档",
    isStarred: false,
    needsApproval: false,
  },
]

export function DocumentList({ viewMode, isLoading, onSubmitApproval, onViewApproval }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)

  const toggleStar = (id: string) => {
    setDocuments((docs) => docs.map((doc) => (doc.id === id ? { ...doc, isStarred: !doc.isStarred } : doc)))
  }

  const deleteDocument = (id: string) => {
    setDocuments((docs) => docs.filter((doc) => doc.id !== id))
  }

  // 获取文件图标
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="h-10 w-10 text-red-500" />
      case "docx":
      case "doc":
        return <FileText className="h-10 w-10 text-blue-600" />
      case "xlsx":
      case "xls":
        return <FileSpreadsheet className="h-10 w-10 text-green-600" />
      case "pptx":
      case "ppt":
        return <FileText className="h-10 w-10 text-orange-500" />
      case "jpg":
      case "png":
      case "gif":
        return <FileImage className="h-10 w-10 text-purple-500" />
      case "zip":
      case "rar":
        return <FileArchive className="h-10 w-10 text-yellow-600" />
      default:
        return <File className="h-10 w-10 text-gray-500" />
    }
  }

  // 获取审批状态标签
  const getApprovalStatusBadge = (status: string | null | undefined) => {
    if (status === undefined || status === null) return null

    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock size={12} className="mr-1" />
            审批中
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle size={12} className="mr-1" />
            已批准
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle size={12} className="mr-1" />
            已拒绝
          </Badge>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return viewMode === "grid" ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="border-t p-4 bg-muted/20">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    ) : (
      <div className="space-y-2">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center p-2 border rounded-md">
              <Skeleton className="h-10 w-10 rounded-md mr-3" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
      </div>
    )
  }

  return viewMode === "grid" ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getFileIcon(doc.type)}
                  <div>
                    <h3 className="font-medium line-clamp-2">{doc.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <Badge variant="outline" className="mr-2">
                        {doc.category}
                      </Badge>
                      <span>{doc.size}</span>
                    </div>
                    {doc.approvalStatus && <div className="mt-2">{getApprovalStatusBadge(doc.approvalStatus)}</div>}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleStar(doc.id)
                  }}
                  className={doc.isStarred ? "text-yellow-500" : "text-gray-400"}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="border-t p-3 bg-muted/20 flex items-center justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{doc.updatedAt}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    查看
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    下载
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="h-4 w-4 mr-2" />
                    分享
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    编辑
                  </DropdownMenuItem>
                  {doc.needsApproval && !doc.approvalStatus && onSubmitApproval && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onSubmitApproval(doc.id, doc.title, doc.category)
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      提交审批
                    </DropdownMenuItem>
                  )}
                  {doc.approvalStatus && onViewApproval && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewApproval(`approval-${doc.id}`)
                      }}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      查看审批
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteDocument(doc.id)
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center p-3 border rounded-md hover:bg-muted/20 transition-colors">
          <div className="mr-3">{getFileIcon(doc.type)}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{doc.title}</h3>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Badge variant="outline" className="mr-2">
                {doc.category}
              </Badge>
              <span className="mr-2">{doc.size}</span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {doc.updatedAt}
              </span>
            </div>
            {doc.approvalStatus && <div className="mt-1">{getApprovalStatusBadge(doc.approvalStatus)}</div>}
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                toggleStar(doc.id)
              }}
              className={doc.isStarred ? "text-yellow-500" : "text-gray-400"}
            >
              <Star className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  查看
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  下载
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  分享
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </DropdownMenuItem>
                {doc.needsApproval && !doc.approvalStatus && onSubmitApproval && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onSubmitApproval(doc.id, doc.title, doc.category)
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    提交审批
                  </DropdownMenuItem>
                )}
                {doc.approvalStatus && onViewApproval && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewApproval(`approval-${doc.id}`)
                    }}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    查看审批
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteDocument(doc.id)
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
