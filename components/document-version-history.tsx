"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Clock, Download, Eye, RotateCcw, GitBranch, FileText } from "lucide-react"

type Version = {
  id: string
  version: string
  description: string
  author: string
  createdAt: string
  size: string
  isCurrent: boolean
  changes: string[]
}

interface DocumentVersionHistoryProps {
  documentId: string
}

export function DocumentVersionHistory({ documentId }: DocumentVersionHistoryProps) {
  const { toast } = useToast()
  const [versions] = useState<Version[]>([
    {
      id: "v2.1",
      version: "2.1",
      description: "更新了第三季度的最新数据，修正了部分图表错误",
      author: "张财务",
      createdAt: "2023-10-15 14:20",
      size: "2.4 MB",
      isCurrent: true,
      changes: ["更新Q3财务数据", "修正图表错误", "添加风险分析"],
    },
    {
      id: "v2.0",
      version: "2.0",
      description: "重大版本更新，重新设计了报告结构",
      author: "李经理",
      createdAt: "2023-10-10 09:30",
      size: "2.2 MB",
      isCurrent: false,
      changes: ["重新设计报告结构", "添加执行摘要", "优化数据展示"],
    },
    {
      id: "v1.5",
      version: "1.5",
      description: "添加了现金流分析和市场表现数据",
      author: "张财务",
      createdAt: "2023-10-05 16:45",
      size: "2.0 MB",
      isCurrent: false,
      changes: ["添加现金流分析", "补充市场表现数据", "修正计算错误"],
    },
    {
      id: "v1.0",
      version: "1.0",
      description: "初始版本，包含基本的财务数据",
      author: "张财务",
      createdAt: "2023-10-01 09:30",
      size: "1.8 MB",
      isCurrent: false,
      changes: ["创建初始版本", "添加基础财务数据", "设置报告模板"],
    },
  ])

  const handleRestore = (version: Version) => {
    toast({
      title: "版本恢复",
      description: `正在恢复到版本 ${version.version}...`,
    })
  }

  const handleDownload = (version: Version) => {
    toast({
      title: "下载开始",
      description: `正在下载版本 ${version.version}...`,
    })
  }

  const handlePreview = (version: Version) => {
    toast({
      title: "预览版本",
      description: `正在预览版本 ${version.version}...`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch size={20} />
          版本历史
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versions.map((version, index) => (
            <div key={version.id} className="relative">
              {index !== versions.length - 1 && <div className="absolute left-6 top-12 w-px h-full bg-border"></div>}
              <div className="flex gap-4">
                <div className="relative">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      version.isCurrent ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <FileText size={20} />
                  </div>
                  {version.isCurrent && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">版本 {version.version}</h3>
                      {version.isCurrent && <Badge>当前版本</Badge>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(version)}>
                        <Eye size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(version)}>
                        <Download size={14} />
                      </Button>
                      {!version.isCurrent && (
                        <Button variant="ghost" size="sm" onClick={() => handleRestore(version)}>
                          <RotateCcw size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{version.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">{version.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{version.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{version.createdAt}</span>
                    </div>
                    <span>{version.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {version.changes.map((change, changeIndex) => (
                      <Badge key={changeIndex} variant="outline" className="text-xs">
                        {change}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
