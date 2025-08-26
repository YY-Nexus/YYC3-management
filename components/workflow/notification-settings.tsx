"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Smartphone, AlertTriangle, Clock, ArrowUpRight } from "lucide-react"
import { notificationService } from "@/lib/services/notification-service"
import { useAuth } from "@/lib/hooks/use-auth"

export function NotificationSettings() {
  const { user } = useAuth()
  const [pushEnabled, setPushEnabled] = useState(false)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [escalationEnabled, setEscalationEnabled] = useState(true)
  const [warningEnabled, setWarningEnabled] = useState(true)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [pushSupported, setPushSupported] = useState(false)

  // 检查推送通知支持情况
  useEffect(() => {
    const checkPushSupport = () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window
      setPushSupported(supported)
    }

    checkPushSupport()
  }, [])

  // 检查是否已订阅
  useEffect(() => {
    const checkSubscription = async () => {
      if (!pushSupported) return

      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setPushEnabled(!!subscription)
      } catch (error) {
        console.error("Error checking push subscription:", error)
      }
    }

    checkSubscription()
  }, [pushSupported])

  // 订阅推送通知
  const subscribeToPush = async () => {
    if (!user || !pushSupported) return

    setIsSubscribing(true)

    try {
      // 注册 Service Worker
      const registration = await navigator.serviceWorker.register("/service-worker.js")
      await navigator.serviceWorker.ready

      // 获取公钥
      const publicKey = notificationService.getPublicKey()
      const convertedKey = urlBase64ToUint8Array(publicKey)

      // 创建订阅
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      })

      // 将订阅信息发送到服务器
      await notificationService.registerPushSubscription(user.id, subscription)

      setPushEnabled(true)
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      alert("订阅推送通知失败，请检查浏览器权限设置")
    } finally {
      setIsSubscribing(false)
    }
  }

  // 取消订阅推送通知
  const unsubscribeFromPush = async () => {
    if (!user) return

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
        await notificationService.unregisterPushSubscription(user.id)
      }

      setPushEnabled(false)
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
    }
  }

  // 保存通知设置
  const saveSettings = async () => {
    // 在实际应用中，这里会将设置保存到服务器
    alert("通知设置已保存")
  }

  // 辅助函数：将 URL Base64 转换为 Uint8Array
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>通知设置</CardTitle>
        <CardDescription>配置如何接收工作流通知</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">通知渠道</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="app-notifications">应用内通知</Label>
              </div>
              <Switch id="app-notifications" checked disabled />
            </div>
            <p className="text-xs text-muted-foreground pl-6">应用内通知始终启用</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="push-notifications">推送通知</Label>
              </div>
              {pushSupported ? (
                <Switch
                  id="push-notifications"
                  checked={pushEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      subscribeToPush()
                    } else {
                      unsubscribeFromPush()
                    }
                  }}
                  disabled={isSubscribing}
                />
              ) : (
                <div className="text-xs text-muted-foreground">不支持</div>
              )}
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              {pushSupported ? "接收浏览器推送通知，即使您未打开应用" : "您的浏览器不支持推送通知"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail text-muted-foreground"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <Label htmlFor="email-notifications">邮件通知</Label>
              </div>
              <Switch id="email-notifications" checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>
            <p className="text-xs text-muted-foreground pl-6">通过电子邮件接收通知</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-message-square text-muted-foreground"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <Label htmlFor="sms-notifications">短信通知</Label>
              </div>
              <Switch id="sms-notifications" checked={smsEnabled} onCheckedChange={setSmsEnabled} />
            </div>
            <p className="text-xs text-muted-foreground pl-6">通过短信接收通知（可能产生费用）</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">通知类型</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="reminder-notifications">任务提醒</Label>
              </div>
              <Switch id="reminder-notifications" checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
            </div>
            <p className="text-xs text-muted-foreground pl-6">任务即将开始或到期的提醒</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="escalation-notifications">任务升级</Label>
              </div>
              <Switch
                id="escalation-notifications"
                checked={escalationEnabled}
                onCheckedChange={setEscalationEnabled}
              />
            </div>
            <p className="text-xs text-muted-foreground pl-6">任务被升级时的通知</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="warning-notifications">警告通知</Label>
              </div>
              <Switch id="warning-notifications" checked={warningEnabled} onCheckedChange={setWarningEnabled} />
            </div>
            <p className="text-xs text-muted-foreground pl-6">任务严重超时的警告通知</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={saveSettings}>保存设置</Button>
      </CardFooter>
    </Card>
  )
}
