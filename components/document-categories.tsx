"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FolderOpen,
  Star,
  Clock,
  FileText,
  Users,
  Briefcase,
  FileSpreadsheet,
  FileImage,
  FileIcon as FilePdf,
} from "lucide-react"

type Category = {
  id: string
  name: string
  icon: React.ReactNode
  count: number
  color?: string
}

export function DocumentCategories() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories: Category[] = [
    {
      id: "all",
      name: "所有文档",
      icon: <FolderOpen className="h-4 w-4" />,
      count: 128,
    },
    {
      id: "starred",
      name: "已收藏",
      icon: <Star className="h-4 w-4" />,
      count: 24,
      color: "text-yellow-500",
    },
    {
      id: "recent",
      name: "最近查看",
      icon: <Clock className="h-4 w-4" />,
      count: 36,
    },
  ]

  const documentTypes: Category[] = [
    {
      id: "word",
      name: "Word文档",
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      count: 45,
    },
    {
      id: "excel",
      name: "Excel表格",
      icon: <FileSpreadsheet className="h-4 w-4 text-green-600" />,
      count: 32,
    },
    {
      id: "pdf",
      name: "PDF文件",
      icon: <FilePdf className="h-4 w-4 text-red-500" />,
      count: 28,
    },
    {
      id: "image",
      name: "图片文件",
      icon: <FileImage className="h-4 w-4 text-purple-500" />,
      count: 23,
    },
  ]

  const departments: Category[] = [
    {
      id: "finance",
      name: "财务部",
      icon: <Briefcase className="h-4 w-4" />,
      count: 18,
    },
    {
      id: "hr",
      name: "人力资源",
      icon: <Users className="h-4 w-4" />,
      count: 24,
    },
    {
      id: "marketing",
      name: "市场营销",
      icon: <Users className="h-4 w-4" />,
      count: 31,
    },
    {
      id: "product",
      name: "产品研发",
      icon: <Users className="h-4 w-4" />,
      count: 42,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>文档分类</CardTitle>
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
              <span className={`mr-2 ${category.color || ""}`}>{category.icon}</span>
              <span className="flex-1 text-left">{category.name}</span>
              <Badge variant="outline" className="ml-auto">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2 px-3">文档类型</h3>
          <div className="space-y-1">
            {documentTypes.map((type) => (
              <Button
                key={type.id}
                variant={activeCategory === type.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveCategory(type.id)}
              >
                <span className="mr-2">{type.icon}</span>
                <span className="flex-1 text-left">{type.name}</span>
                <Badge variant="outline" className="ml-auto">
                  {type.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2 px-3">部门文档</h3>
          <div className="space-y-1">
            {departments.map((dept) => (
              <Button
                key={dept.id}
                variant={activeCategory === dept.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveCategory(dept.id)}
              >
                <span className="mr-2">{dept.icon}</span>
                <span className="flex-1 text-left">{dept.name}</span>
                <Badge variant="outline" className="ml-auto">
                  {dept.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
