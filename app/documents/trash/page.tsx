"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Sidebar } from "@/components/sidebar"
import { Trash2, RotateCcw, FileText, Calendar, User, AlertTriangle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DeletedDocument = {
  id: string
  title: string
  type: string
  category: string
  size: string
  deletedAt: string
  deletedBy: string
  originalPath: string
  autoDeleteAt: string
}

export default function DocumentTrashPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const { toast } = useToast()

  const deletedDocuments: DeletedDocument[] = [
    {
      id: "1",
      title: "旧版财务报告草稿",
      type: "docx",
      category: "财务报告",
      size: "1.8 MB",
      deletedAt: "2023-10-10 14:30",
      deletedBy: "张财务",
      originalPath: "/财务部/2023年/Q3报告",
      autoDeleteAt: "2023-11-10 14:30",
    },
    {
      id: "2",
      title: "过期的项目计划",
      type: "pdf",
      category: "项目文档",
      size: "2.1 MB",
      deletedAt: "2023-10-08 09:15",
      deletedBy: "李项目",
      originalPath: "/项目管理/已完成项目",
      autoDeleteAt: "2023-11-08 09:15",
    },
    {
      id: "3",
      title: "临时会议记录",
      type: "docx",
      category: "会议纪要",
      size: "0.5 MB",
      deletedAt: "2023-10-05 16:20",
      deletedBy: "王秘书",
      originalPath: "/行政部/会议记录/2023",
      autoDeleteAt: "2023-11-05 16:20",
    },
  ]

  const filteredDocuments = deletedDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || doc.type === filterType
    return matchesSearch && matchesType
  })

  const handleSelectAll = () => {
    if (selectedItems.length === filteredDocuments.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredDocuments.map((doc) => doc.id))
    }
  }

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleRestore = (ids: string[]) => {
    toast({
      title: "文档已恢复",
      description: `已恢复 ${ids.length} 个文档到原始位置`,
    })
    setSelectedItems([])
  }

  const handlePermanentDelete = (ids: string[]) => {
    toast({
      title: "文档已永久删除",
      description: `已永久删除 ${ids.length} 个文档，此操作无法撤销`,
      variant: "destructive",
    })
    setSelectedItems([])
  }

  const handleEmptyTrash = () => {
    toast({
      title: "回收站已清空",
      description: "所有文档已被永久删除，此操作无法撤销",
      variant: "destructive",
    })
    setSelectedItems([])
  }

  const getFileIcon = (type: string) => {
    return <FileText className="h-10 w-10 text-muted-foreground" />
  }

  const getDaysUntilAutoDelete = (autoDeleteAt: string) => {
    const now = new Date()
    const deleteDate = new Date(autoDeleteAt)
    const diffTime = deleteDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">回收站</h1>
              <p className="text-muted-foreground">管理已删除的文档，30天后将自动永久删除</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <>
                  <Button onClick={() => handleRestore(selectedItems)}>
                    <RotateCcw size={16} className="mr-2" />
                    恢复选中
                  </Button>
                  <Button variant="destructive" onClick={() => handlePermanentDelete(selectedItems)}>
                    <Trash2 size={16} className="mr-2" />
                    永久删除
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={handleEmptyTrash} disabled={filteredDocuments.length === 0}>
                清空回收站
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>已删除的文档</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="搜索已删除文档..."
                      className="pl-8 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="文件类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="docx">Word文档</SelectItem>
                      <SelectItem value="pdf">PDF文件</SelectItem>
                      <SelectItem value="xlsx">Excel表格</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredDocuments.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Checkbox
                      checked={selectedItems.length === filteredDocuments.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">
                      已选择 {selectedItems.length} / {filteredDocuments.length} 项
                    </span>
                  </div>

                  {filteredDocuments.map((doc) => {
                    const daysLeft = getDaysUntilAutoDelete(doc.autoDeleteAt)
                    return (
                      <div
                        key={doc.id}
                        className={`flex items-center p-4 border rounded-md transition-colors ${
                          selectedItems.includes(doc.id) ? "bg-primary/5 border-primary/30" : "hover:bg-muted/20"
                        }`}
                      >
                        <Checkbox
                          checked={selectedItems.includes(doc.id)}
                          onCheckedChange={() => handleSelectItem(doc.id)}
                          className="mr-3"
                        />
                        <div className="mr-4">{getFileIcon(doc.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{doc.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User size={12} />
                              <span>删除者: {doc.deletedBy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>删除时间: {doc.deletedAt}</span>
                            </div>
                            <span>大小: {doc.size}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{doc.category}</Badge>
                            <span className="text-xs text-muted-foreground">原路径: {doc.originalPath}</span>
                          </div>
                          {daysLeft <= 7 && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                              <AlertTriangle size={12} />
                              <span>{daysLeft > 0 ? `${daysLeft} 天后自动删除` : "即将自动删除"}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleRestore([doc.id])}>
                            <RotateCcw size={14} className="mr-1" />
                            恢复
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handlePermanentDelete([doc.id])}>
                            <Trash2 size={14} className="mr-1" />
                            永久删除
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Trash2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">回收站为空</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterType !== "all" ? "没有找到匹配的已删除文档" : "没有已删除的文档"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
