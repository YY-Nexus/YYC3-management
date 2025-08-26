"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Clock, AlertTriangle, CheckCircle, XCircle, FileText, Settings, BellOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

type NotificationType = "overdue" | "pending" | "reminder" | "approved" | "rejected" | "comment"

type Notification = {
  id: string
  type: NotificationType
  title: string
  message: string
  documentId: string
  documentTitle: string
  time: string
  read: boolean
  urgent?: boolean
}

export function DocumentApprovalNotifications() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    overdueReminder: true,
    pendingReminder: true,
    commentNotification: true,
    statusChangeNotification: true,
    reminderTime: "1day",
  })
  const { toast } = useToast()

  // 模拟通知数据
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "notif-1",
        type: "overdue",
        title: "审批已逾期",
        message: "您有一个审批已经逾期，请尽快处理",
        documentId: "doc-1",
        documentTitle: "2023年第三季度财务报告",
        time: "2小时前",
        read: false,
        urgent: true,
      },
      {
        id: "notif-2",
        type: "pending",
        title: "待处理审批",
        message: "您有一个新的审批需要处理",
        documentId: "doc-2",
        documentTitle: "市场推广计划",
        time: "4小时前",
        read: false,
      },
      {
        id: "notif-3",
        type: "reminder",
        title: "审批即将到期",
        message: "您有一个审批将在明天到期",
        documentId: "doc-3",
        documentTitle: "产品发布策略",
        time: "昨天",
        read: true,
      },
      {
        id: "notif-4",
        type: "approved",
        title: "审批已通过",
        message: "您提交的文档已被批准",
        documentId: "doc-4",
        documentTitle: "人力资源规划",
        time: "2天前",
        read: true,
      },
      {
        id: "notif-5",
        type: "rejected",
        title: "审批被拒绝",
        message: "您提交的文档被拒绝，请查看拒绝原因",
        documentId: "doc-5",
        documentTitle: "技术研发报告",
        time: "3天前",
        read: true,
      },
      {
        id: "notif-6",
        type: "comment",
        title: "新评论",
        message: "李经理在您的审批中添加了评论",
        documentId: "doc-6",
        documentTitle: "销售策略报告",
        time: "3天前",
        read: true,
      },
    ]

    setNotifications(mockNotifications)
  }, [])

  // 标记通知为已读
  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  // 标记所有通知为已读
  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
    toast({
      title: "已全部标为已读",
      description: "所有通知已标记为已读",
    })
  }

  // 删除通知
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  // 保存设置
  const saveSettings = () => {
    toast({
      title: "设置已保存",
      description: "您的通知设置已成功保存",
    })
  }

  // 获取通知图标
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "overdue":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "reminder":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "comment":
        return <FileText className="h-5 w-5 text-purple-500" />
    }
  }

  // 获取未读通知数量
  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">审批提醒</h1>
          <p className="text-muted-foreground">管理您的审批通知和提醒</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell size={16} />
            通知
            {unreadCount > 0 && <Badge className="ml-1 bg-red-500 text-white">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings size={16} />
            设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>通知中心</CardTitle>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    全部标为已读
                  </Button>
                )}
              </div>
              <CardDescription>查看您的审批通知和提醒</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start p-3 border rounded-md ${
                        !notification.read ? "bg-primary/5 border-primary/30" : ""
                      } ${notification.urgent ? "border-red-300" : ""}`}
                    >
                      <div className="mr-3 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium flex items-center">
                            {notification.title}
                            {!notification.read && <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span>}
                            {notification.urgent && (
                              <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                                紧急
                              </Badge>
                            )}
                          </h3>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex items-center mt-2">
                          <FileText size={14} className="mr-1 text-muted-foreground" />
                          <span className="text-sm">{notification.documentTitle}</span>
                        </div>
                        <div className="flex justify-end mt-2 gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              标为已读
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            删除
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            查看详情
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium mb-2">没有通知</h3>
                    <p className="text-muted-foreground">您目前没有任何通知</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
              <CardDescription>配置您的审批通知和提醒方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">通知方式</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">电子邮件通知</Label>
                      <p className="text-sm text-muted-foreground">通过电子邮件接收通知</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, email: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">推送通知</Label>
                      <p className="text-sm text-muted-foreground">在浏览器和移动设备上接收推送通知</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, push: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">短信通知</Label>
                      <p className="text-sm text-muted-foreground">通过短信接收重要通知</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notificationSettings.sms}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, sms: checked })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">通知类型</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="overdue-reminder">逾期提醒</Label>
                      <p className="text-sm text-muted-foreground">当审批逾期时接收提醒</p>
                    </div>
                    <Switch
                      id="overdue-reminder"
                      checked={notificationSettings.overdueReminder}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, overdueReminder: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pending-reminder">待处理提醒</Label>
                      <p className="text-sm text-muted-foreground">当有新的待处理审批时接收提醒</p>
                    </div>
                    <Switch
                      id="pending-reminder"
                      checked={notificationSettings.pendingReminder}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, pendingReminder: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="comment-notification">评论通知</Label>
                      <p className="text-sm text-muted-foreground">当有人在您的审批中添加评论时接收通知</p>
                    </div>
                    <Switch
                      id="comment-notification"
                      checked={notificationSettings.commentNotification}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, commentNotification: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="status-change-notification">状态变更通知</Label>
                      <p className="text-sm text-muted-foreground">当您的审批状态变更时接收通知</p>
                    </div>
                    <Switch
                      id="status-change-notification"
                      checked={notificationSettings.statusChangeNotification}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, statusChangeNotification: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">提醒设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminder-time">提前提醒时间</Label>
                      <p className="text-sm text-muted-foreground">在审批到期前多久提醒您</p>
                    </div>
                    <Select
                      value={notificationSettings.reminderTime}
                      onValueChange={(value) =>
                        setNotificationSettings({ ...notificationSettings, reminderTime: value })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择提醒时间" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1hour">1小时前</SelectItem>
                        <SelectItem value="3hours">3小时前</SelectItem>
                        <SelectItem value="1day">1天前</SelectItem>
                        <SelectItem value="2days">2天前</SelectItem>
                        <SelectItem value="1week">1周前</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings}>保存设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
