"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Sidebar } from "@/components/sidebar"
import {
  FileText,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Template = {
  id: string
  name: string
  description: string
  category: string
  type: string
  thumbnail: string
  author: string
  createdAt: string
  usageCount: number
  isStarred: boolean
  tags: string[]
}

export default function DocumentTemplatesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCategory, setActiveCategory] = useState("all")
  const { toast } = useToast()

  const templates: Template[] = [
    {
      id: "1",
      name: "财务报告模板",
      description: "标准的季度财务报告模板，包含完整的财务分析结构",
      category: "财务",
      type: "docx",
      thumbnail: "/placeholder.svg?height=200&width=300&text=财务报告",
      author: "张财务",
      createdAt: "2023-09-15",
      usageCount: 45,
      isStarred: true,
      tags: ["财务", "报告", "季度"],
    },
    {
      id: "2",
      name: "项目计划书模板",
      description: "项目启动和规划的标准模板，适用于各类项目",
      category: "项目管理",
      type: "docx",
      thumbnail: "/placeholder.svg?height=200&width=300&text=项目计划",
      author: "李项目",
      createdAt: "2023-09-10",
      usageCount: 32,
      isStarred: false,
      tags: ["项目", "计划", "管理"],
    },
    {
      id: "3",
      name: "会议纪要模板",
      description: "标准的会议记录模板，包含议程、决议和行动项",
      category: "会议",
      type: "docx",
      thumbnail: "/placeholder.svg?height=200&width=300&text=会议纪要",
      author: "王秘书",
      createdAt: "2023-09-05",
      usageCount: 78,
      isStarred: true,
      tags: ["会议", "纪要", "记录"],
    },
    {
      id: "4",
      name: "合同协议模板",
      description: "通用的商务合同模板，包含标准条款和格式",
      category: "法务",
      type: "docx",
      thumbnail: "/placeholder.svg?height=200&width=300&text=合同协议",
      author: "赵法务",
      createdAt: "2023-08-28",
      usageCount: 23,
      isStarred: false,
      tags: ["合同", "法务", "协议"],
    },
    {
      id: "5",
      name: "产品需求文档模板",
      description: "产品功能需求的详细描述模板，适用于产品开发",
      category: "产品",
      type: "docx",
      thumbnail: "/placeholder.svg?height=200&width=300&text=需求文档",
      author: "孙产品",
      createdAt: "2023-08-20",
      usageCount: 56,
      isStarred: true,
      tags: ["产品", "需求", "开发"],
    },
    {
      id: "6",
      name: "员工手册模板",
      description: "新员工入职手册模板，包含公司制度和流程",
      category: "人事",
      type: "pdf",
      thumbnail: "/placeholder.svg?height=200&width=300&text=员工手册",
      author: "钱人事",
      createdAt: "2023-08-15",
      usageCount: 34,
      isStarred: false,
      tags: ["人事", "手册", "入职"],
    },
  ]

  const categories = [
    { id: "all", name: "全部模板", count: templates.length },
    { id: "财务", name: "财务", count: templates.filter((t) => t.category === "财务").length },
    { id: "项目管理", name: "项目管理", count: templates.filter((t) => t.category === "项目管理").length },
    { id: "会议", name: "会议", count: templates.filter((t) => t.category === "会议").length },
    { id: "法务", name: "法务", count: templates.filter((t) => t.category === "法务").length },
    { id: "产品", name: "产品", count: templates.filter((t) => t.category === "产品").length },
    { id: "人事", name: "人事", count: templates.filter((t) => t.category === "人事").length },
  ]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = activeCategory === "all" || template.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (template: Template) => {
    toast({
      title: "模板已应用",
      description: `正在基于"${template.name}"创建新文档...`,
    })
  }

  const handleStarToggle = (templateId: string) => {
    toast({
      title: "收藏状态已更新",
      description: "模板收藏状态已更新",
    })
  }

  const TemplateCard = ({ template }: { template: Template }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-muted relative">
        <img
          src={template.thumbnail || "/placeholder.svg"}
          alt={template.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/80 hover:bg-white"
            onClick={() => handleStarToggle(template.id)}
          >
            <Star size={14} className={template.isStarred ? "fill-yellow-400 text-yellow-400" : ""} />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium line-clamp-1">{template.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleUseTemplate(template)}>
                <Plus size={14} className="mr-2" />
                使用模板
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye size={14} className="mr-2" />
                预览
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download size={14} className="mr-2" />
                下载
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Copy size={14} className="mr-2" />
                复制模板
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit size={14} className="mr-2" />
                编辑模板
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 size={14} className="mr-2" />
                删除模板
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{template.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{template.author}</span>
          <span>使用 {template.usageCount} 次</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Button className="w-full" onClick={() => handleUseTemplate(template)}>
          使用此模板
        </Button>
      </CardContent>
    </Card>
  )

  const TemplateListItem = ({ template }: { template: Template }) => (
    <div className="flex items-center p-4 border rounded-md hover:bg-muted/20 transition-colors">
      <div className="w-16 h-12 bg-muted rounded mr-4 flex-shrink-0">
        <img
          src={template.thumbnail || "/placeholder.svg"}
          alt={template.name}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium truncate">{template.name}</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleStarToggle(template.id)}>
              <Star size={14} className={template.isStarred ? "fill-yellow-400 text-yellow-400" : ""} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleUseTemplate(template)}>
                  <Plus size={14} className="mr-2" />
                  使用模板
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye size={14} className="mr-2" />
                  预览
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download size={14} className="mr-2" />
                  下载
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{template.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{template.author}</span>
            <span>{template.createdAt}</span>
            <span>使用 {template.usageCount} 次</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="ml-4">
        <Button onClick={() => handleUseTemplate(template)}>使用模板</Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">文档模板</h1>
              <p className="text-muted-foreground">使用预设模板快速创建文档</p>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus size={16} className="mr-2" />
                创建模板
              </Button>
              <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List size={16} /> : <Grid3X3 size={16} />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>模板分类</CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <span className="flex-1 text-left">{category.name}</span>
                        <Badge variant="outline" className="ml-auto">
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>模板库</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="搜索模板..."
                          className="pl-8 w-[200px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter size={14} className="mr-1" />
                        筛选
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTemplates.map((template) => (
                        <TemplateCard key={template.id} template={template} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredTemplates.map((template) => (
                        <TemplateListItem key={template.id} template={template} />
                      ))}
                    </div>
                  )}

                  {filteredTemplates.length === 0 && (
                    <div className="text-center py-10">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium mb-2">没有找到模板</h3>
                      <p className="text-muted-foreground">尝试调整搜索条件或选择其他分类</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
