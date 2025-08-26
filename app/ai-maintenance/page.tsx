"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Check, X } from "lucide-react"

type Task = {
  id: number
  title: string
  description: string
  status: "pending" | "completed"
  dueDate: Date
}

type Customer = {
  id: number
  name: string
  lastContact: Date
  nextContact: Date
  notes: string
}

export default function AIMaintenance() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "系统更新", description: "执行每周系统更新", status: "pending", dueDate: new Date(2023, 5, 15) },
    { id: 2, title: "数据备份", description: "执行每日数据备份", status: "completed", dueDate: new Date(2023, 5, 14) },
  ])
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: "张三",
      lastContact: new Date(2023, 5, 1),
      nextContact: new Date(2023, 5, 15),
      notes: "需要跟进新产品信息",
    },
    {
      id: 2,
      name: "李四",
      lastContact: new Date(2023, 5, 10),
      nextContact: new Date(2023, 5, 20),
      notes: "对升级服务感兴趣",
    },
  ])
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "status">>({
    title: "",
    description: "",
    dueDate: new Date(),
  })
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id">>({
    name: "",
    lastContact: new Date(),
    nextContact: new Date(),
    notes: "",
  })

  useEffect(() => {
    const interval = setInterval(() => {
      checkTasksAndNotify()
      checkCustomersAndNotify()
    }, 60000) // 每分钟检查一次

    return () => clearInterval(interval)
  }, [])

  const checkTasksAndNotify = () => {
    const now = new Date()
    tasks.forEach((task) => {
      if (task.status === "pending" && task.dueDate <= now) {
        toast({
          title: "任务提醒",
          description: `任务 "${task.title}" 已到期，请尽快处理。`,
        })
      }
    })
  }

  const checkCustomersAndNotify = () => {
    const now = new Date()
    customers.forEach((customer) => {
      if (customer.nextContact <= now) {
        toast({
          title: "客户回访提醒",
          description: `是时候联系 ${customer.name} 了。`,
        })
      }
    })
  }

  const addTask = () => {
    if (newTask.title && newTask.description) {
      setTasks([...tasks, { ...newTask, id: tasks.length + 1, status: "pending" }])
      setNewTask({ title: "", description: "", dueDate: new Date() })
      toast({
        title: "任务已添加",
        description: "新任务已成功添加到列表中。",
      })
    }
  }

  const addCustomer = () => {
    if (newCustomer.name) {
      setCustomers([...customers, { ...newCustomer, id: customers.length + 1 }])
      setNewCustomer({ name: "", lastContact: new Date(), nextContact: new Date(), notes: "" })
      toast({
        title: "客户已添加",
        description: "新客户已成功添加到列表中。",
      })
    }
  }

  const toggleTaskStatus = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: task.status === "pending" ? "completed" : "pending" } : task,
      ),
    )
  }

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">AI机维模块</h1>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">任务管理</TabsTrigger>
          <TabsTrigger value="customers">客户回访</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="task-title">任务标题</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="输入任务标题"
                />
              </div>
              <div>
                <Label htmlFor="task-description">任务描述</Label>
                <Input
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="输入任务描述"
                />
              </div>
              <div>
                <Label htmlFor="task-due-date">截止日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newTask.dueDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.dueDate ? format(newTask.dueDate, "PPP") : <span>选择日期</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTask.dueDate}
                      onSelect={(date) => date && setNewTask({ ...newTask, dueDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button onClick={addTask} className="btn-3d">
              添加任务
            </Button>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>状态</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>截止日期</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      {task.status === "completed" ? (
                        <Check className="text-green-500" />
                      ) : (
                        <X className="text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{format(task.dueDate, "yyyy-MM-dd")}</TableCell>
                    <TableCell>
                      <Button onClick={() => toggleTaskStatus(task.id)} className="btn-3d">
                        {task.status === "completed" ? "标记为未完成" : "标记为已完成"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="customer-name">客户名称</Label>
                <Input
                  id="customer-name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="输入客户名称"
                />
              </div>
              <div>
                <Label htmlFor="last-contact">上次联系日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newCustomer.lastContact && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newCustomer.lastContact ? format(newCustomer.lastContact, "PPP") : <span>选择日期</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newCustomer.lastContact}
                      onSelect={(date) => date && setNewCustomer({ ...newCustomer, lastContact: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="next-contact">下次联系日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newCustomer.nextContact && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newCustomer.nextContact ? format(newCustomer.nextContact, "PPP") : <span>选择日期</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newCustomer.nextContact}
                      onSelect={(date) => date && setNewCustomer({ ...newCustomer, nextContact: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="customer-notes">备注</Label>
                <Textarea
                  id="customer-notes"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  placeholder="输入客户备注"
                />
              </div>
            </div>
            <Button onClick={addCustomer} className="btn-3d">
              添加客户
            </Button>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>客户名称</TableHead>
                  <TableHead>上次联系日期</TableHead>
                  <TableHead>下次联系日期</TableHead>
                  <TableHead>备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{format(customer.lastContact, "yyyy-MM-dd")}</TableCell>
                    <TableCell>{format(customer.nextContact, "yyyy-MM-dd")}</TableCell>
                    <TableCell>{customer.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
