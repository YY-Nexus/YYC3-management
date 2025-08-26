"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileUp, Search, FileText, Download, Eye, Trash2, Plus, Filter } from "lucide-react"

// 模拟档案文件数据
const generateFilesData = (employeeId: string) => {
  const files = [
    {
      id: "1",
      name: "入职申请表.pdf",
      category: "入职材料",
      size: "1.2 MB",
      uploadDate: "2020-05-15",
      uploadBy: "李行政",
    },
    {
      id: "2",
      name: "身份证复印件.jpg",
      category: "身份证明",
      size: "0.8 MB",
      uploadDate: "2020-05-15",
      uploadBy: "李行政",
    },
    {
      id: "3",
      name: "学历证书.pdf",
      category: "学历证明",
      size: "2.1 MB",
      uploadDate: "2020-05-15",
      uploadBy: "李行政",
    },
    {
      id: "4",
      name: "前公司离职证明.pdf",
      category: "工作经历",
      size: "1.5 MB",
      uploadDate: "2020-05-15",
      uploadBy: "李行政",
    },
    {
      id: "5",
      name: "培训证书-项目管理.pdf",
      category: "培训证书",
      size: "3.2 MB",
      uploadDate: "2021-08-20",
      uploadBy: "冯人事",
    },
    {
      id: "6",
      name: "年度绩效评估-2022.pdf",
      category: "绩效评估",
      size: "1.8 MB",
      uploadDate: "2023-01-15",
      uploadBy: "冯人事",
    },
    {
      id: "7",
      name: "晋升申请表.pdf",
      category: "晋升材料",
      size: "1.4 MB",
      uploadDate: "2023-06-10",
      uploadBy: "冯人事",
    },
  ]

  return files
}

interface EmployeeFilesProps {
  employeeId: string
}

export function EmployeeFiles({ employeeId }: EmployeeFilesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // 获取档案文件数据
  const files = generateFilesData(employeeId)

  // 文件类别列表
  const categories = ["all", ...new Set(files.map((file) => file.category))]

  // 过滤文件
  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // 获取文件图标
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "xls":
      case "xlsx":
        return <FileText className="h-5 w-5 text-green-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <FileText className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">档案文件</h2>
          <Badge variant="outline" className="ml-2">
            {files.length} 个文件
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <FileUp className="mr-2 h-4 w-4" />
            上传文件
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="搜索文件..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">所有类别</option>
            {categories
              .filter((cat) => cat !== "all")
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>文件名</TableHead>
                <TableHead>类别</TableHead>
                <TableHead>大小</TableHead>
                <TableHead>上传日期</TableHead>
                <TableHead>上传人</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.name)}
                        <span className="font-medium">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {file.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{file.uploadDate}</TableCell>
                    <TableCell>{file.uploadBy}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FileText className="h-12 w-12 mb-2 text-gray-300" />
                      <p>没有找到匹配的文件</p>
                      <Button variant="outline" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        上传新文件
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
