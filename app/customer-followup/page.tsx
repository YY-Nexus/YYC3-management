"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Search, Calendar, Phone, AlertCircle, CheckCircle, Filter, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

type Customer = {
  id: number
  name: string
  phone: string
  memberNo: string
  date: string
  notes: string
  lastContact: string
  nextContact: string
  status: "active" | "inactive" | "vip"
  tags: string[]
}

export default function CustomerFollowup() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: "张三",
      phone: "13800138000",
      memberNo: "M001",
      date: "2023-06-01",
      notes: "VIP客户，对新产品有兴趣",
      lastContact: "2023-05-15",
      nextContact: "2023-06-15",
      status: "vip",
      tags: ["潜在客户", "高消费"],
    },
    {
      id: 2,
      name: "李四",
      phone: "13900139000",
      memberNo: "M002",
      date: "2023-06-02",
      notes: "新客户，首次购买",
      lastContact: "2023-05-20",
      nextContact: "2023-06-20",
      status: "active",
      tags: ["新客户"],
    },
    {
      id: 3,
      name: "王五",
      phone: "13700137000",
      memberNo: "M003",
      date: "2023-05-15",
      notes: "长期客户，需要定期回访",
      lastContact: "2023-05-10",
      nextContact: "2023-06-10",
      status: "active",
      tags: ["老客户", "定期回访"],
    },
    {
      id: 4,
      name: "赵六",
      phone: "13600136000",
      memberNo: "M004",
      date: "2023-04-20",
      notes: "客户已流失，需要挽回",
      lastContact: "2023-04-15",
      nextContact: "2023-06-05",
      status: "inactive",
      tags: ["流失客户"],
    },
  ])

  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id" | "status" | "tags">>({
    name: "",
    phone: "",
    memberNo: "",
    date: "",
    notes: "",
    lastContact: "",
    nextContact: "",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)

  // 所有可用的标签
  const allTags = ["新客户", "老客户", "VIP", "潜在客户", "高消费", "定期回访", "流失客户"]

  // 检查今日需要回访的客户
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const todayFollowups = customers.filter((customer) => customer.nextContact === today)

    if (todayFollowups.length > 0) {
      toast({
        title: "今日回访提醒",
        description: `您有 ${todayFollowups.length} 位客户需要今天回访`,
      })
    }
  }, [customers, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCustomer((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    setError(null)

    if (!newCustomer.name.trim()) {
      setError("请输入客户姓名")
      return false
    }

    if (!newCustomer.phone) {
      setError("请输入电话号码")
      return false
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(newCustomer.phone)) {
      setError("请输入有效的手机号码")
      return false
    }

    if (!newCustomer.memberNo) {
      setError("请输入会员编号")
      return false
    }

    return true
  }

  const addOrUpdateCustomer = () => {
    if (!validateForm()) return

    setIsLoading(true)

    // 模拟API请求延迟
    setTimeout(() => {
      if (isEditing && editingId !== null) {
        setCustomers(
          customers.map((customer) =>
            customer.id === editingId
              ? {
                  ...newCustomer,
                  id: editingId,
                  status: customer.status,
                  tags: customer.tags,
                }
              : customer,
          ),
        )
        setIsEditing(false)
        setEditingId(null)
        toast({
          title: "更新成功",
          description: `客户 ${newCustomer.name} 的信息已更新`,
        })
      } else {
        const newId = customers.length > 0 ? Math.max(...customers.map((c) => c.id)) + 1 : 1
        setCustomers([
          ...customers,
          {
            ...newCustomer,
            id: newId,
            status: "active",
            tags: ["新客户"],
          },
        ])
        toast({
          title: "添加成功",
          description: `客户 ${newCustomer.name} 已添加到系统`,
        })
      }

      setNewCustomer({
        name: "",
        phone: "",
        memberNo: "",
        date: "",
        notes: "",
        lastContact: "",
        nextContact: "",
      })
      setShowForm(false)
      setIsLoading(false)
    }, 800)
  }

  const editCustomer = (id: number) => {
    const customerToEdit = customers.find((customer) => customer.id === id)
    if (customerToEdit) {
      setNewCustomer({
        name: customerToEdit.name,
        phone: customerToEdit.phone,
        memberNo: customerToEdit.memberNo,
        date: customerToEdit.date,
        notes: customerToEdit.notes,
        lastContact: customerToEdit.lastContact,
        nextContact: customerToEdit.nextContact,
      })
      setIsEditing(true)
      setEditingId(id)
      setShowForm(true)
    }
  }

  const confirmDelete = (id: number) => {
    setCustomerToDelete(id)
    setShowDeleteConfirm(true)
  }

  const deleteCustomer = () => {
    if (customerToDelete !== null) {
      const customerName = customers.find((c) => c.id === customerToDelete)?.name
      setCustomers(customers.filter((customer) => customer.id !== customerToDelete))
      setShowDeleteConfirm(false)
      setCustomerToDelete(null)
      toast({
        title: "删除成功",
        description: `客户 ${customerName} 已从系统中删除`,
      })
    }
  }

  const toggleCustomerStatus = (id: number) => {
    setCustomers(
      customers.map((customer) => {
        if (customer.id === id) {
          const newStatus = customer.status === "active" ? "inactive" : "active"
          return { ...customer, status: newStatus }
        }
        return customer
      }),
    )
  }

  const addTagToCustomer = (customerId: number, tag: string) => {
    setCustomers(
      customers.map((customer) => {
        if (customer.id === customerId && !customer.tags.includes(tag)) {
          return { ...customer, tags: [...customer.tags, tag] }
        }
        return customer
      }),
    )
  }

  const removeTagFromCustomer = (customerId: number, tagToRemove: string) => {
    setCustomers(
      customers.map((customer) => {
        if (customer.id === customerId) {
          return { ...customer, tags: customer.tags.filter((tag) => tag !== tagToRemove) }
        }
        return customer
      }),
    )
  }

  // 过滤客户列表
  const filteredCustomers = customers.filter((customer) => {
    // 搜索条件
    const matchesSearch =
      customer.name.includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      customer.memberNo.includes(searchTerm)

    // 状态过滤
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    // 标签过滤
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => customer.tags.includes(tag))

    // 标签页过滤
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "today" && customer.nextContact === new Date().toISOString().split("T")[0]) ||
      (activeTab === "overdue" && customer.nextContact < new Date().toISOString().split("T")[0]) ||
      (activeTab === "vip" && customer.status === "vip")

    return matchesSearch && matchesStatus && matchesTags && matchesTab
  })

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">客户回访管理</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>客户筛选</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="搜索客户姓名、电话或会员号"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="客户状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">非活跃</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Button variant="outline" className="w-full flex justify-between items-center">
                <span>标签筛选 ({selectedTags.length})</span>
                <Filter size={16} />
              </Button>
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border p-2 hidden group-focus-within:block">
                {allTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2 p-1">
                    <input
                      type="checkbox"
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags([...selectedTags, tag])
                        } else {
                          setSelectedTags(selectedTags.filter((t) => t !== tag))
                        }
                      }}
                    />
                    <label htmlFor={`tag-${tag}`}>{tag}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">全部客户</TabsTrigger>
            <TabsTrigger value="today">今日回访</TabsTrigger>
            <TabsTrigger value="overdue">逾期回访</TabsTrigger>
            <TabsTrigger value="vip">VIP客户</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => setShowForm(true)} className="btn-3d">
          添加新客户
        </Button>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">未找到客户</h3>
          <p className="mt-1 text-gray-500">尝试调整搜索条件或添加新客户</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>电话</TableHead>
                <TableHead>会员NO</TableHead>
                <TableHead>上次联系</TableHead>
                <TableHead>下次联系</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>标签</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className={
                    customer.nextContact === new Date().toISOString().split("T")[0]
                      ? "bg-blue-50"
                      : customer.nextContact < new Date().toISOString().split("T")[0]
                        ? "bg-red-50"
                        : ""
                  }
                >
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <a href={`tel:${customer.phone}`} className="flex items-center text-blue-600 hover:underline">
                      <Phone className="h-3 w-3 mr-1" />
                      {customer.phone}
                    </a>
                  </TableCell>
                  <TableCell>{customer.memberNo}</TableCell>
                  <TableCell>{customer.lastContact}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {customer.nextContact}
                      {customer.nextContact === new Date().toISOString().split("T")[0] && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">今日</span>
                      )}
                      {customer.nextContact < new Date().toISOString().split("T")[0] && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">逾期</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        customer.status === "active"
                          ? "bg-green-100 text-green-800"
                          : customer.status === "inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {customer.status === "active" ? "活跃" : customer.status === "inactive" ? "非活跃" : "VIP"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => editCustomer(customer.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete(customer.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleCustomerStatus(customer.id)}
                        title={customer.status === "active" ? "标记为非活跃" : "标记为活跃"}
                      >
                        {customer.status === "active" ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "编辑客户" : "添加新客户"}</DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                name="name"
                value={newCustomer.name}
                onChange={handleInputChange}
                placeholder="请输入客户姓名"
              />
            </div>
            <div>
              <Label htmlFor="phone">电话 *</Label>
              <Input
                id="phone"
                name="phone"
                value={newCustomer.phone}
                onChange={handleInputChange}
                placeholder="请输入手机号码"
              />
            </div>
            <div>
              <Label htmlFor="memberNo">会员NO *</Label>
              <Input
                id="memberNo"
                name="memberNo"
                value={newCustomer.memberNo}
                onChange={handleInputChange}
                placeholder="请输入会员编号"
              />
            </div>
            <div>
              <Label htmlFor="date">登记日期</Label>
              <Input id="date" name="date" type="date" value={newCustomer.date} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="lastContact">上次联系</Label>
              <Input
                id="lastContact"
                name="lastContact"
                type="date"
                value={newCustomer.lastContact}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="nextContact">下次联系</Label>
              <Input
                id="nextContact"
                name="nextContact"
                type="date"
                value={newCustomer.nextContact}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="notes">备注</Label>
              <Textarea
                id="notes"
                name="notes"
                value={newCustomer.notes}
                onChange={handleInputChange}
                placeholder="请输入客户备注信息"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              取消
            </Button>
            <Button onClick={addOrUpdateCustomer} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : isEditing ? (
                "更新客户"
              ) : (
                "添加客户"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p>您确定要删除此客户吗？此操作无法撤销。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={deleteCustomer}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
