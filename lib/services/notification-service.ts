import type { NotificationRecord } from "../types/workflow-types"

// 模拟推送通知服务
class PushNotificationService {
  private static instance: PushNotificationService
  private subscribers: Map<string, PushSubscription> = new Map()
  private vapidKeys = {
    publicKey: "BLBz4TKmvyhGzZPGgQnM7S9KlKdTYPkEQGQJwn3jP9-NR4-WxFQTQU0JfFPkB-MXKwIeLDGfMxCaXewOxJbVW4A",
    privateKey: "3KzvKasA2SsLQQIpKFuQiQTJJsETf-jIgTJQpPb0j00",
  }

  private constructor() {
    // 私有构造函数，确保单例模式
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService()
    }
    return PushNotificationService.instance
  }

  // 注册订阅
  public async subscribe(userId: string, subscription: PushSubscription): Promise<void> {
    this.subscribers.set(userId, subscription)
    console.log(`User ${userId} subscribed to push notifications`)
  }

  // 取消订阅
  public async unsubscribe(userId: string): Promise<void> {
    this.subscribers.delete(userId)
    console.log(`User ${userId} unsubscribed from push notifications`)
  }

  // 发送推送通知
  public async sendNotification(userId: string, title: string, body: string, data?: any): Promise<boolean> {
    const subscription = this.subscribers.get(userId)
    if (!subscription) {
      console.log(`No subscription found for user ${userId}`)
      return false
    }

    try {
      // 在实际应用中，这里会使用web-push库发送推送通知
      console.log(`Sending push notification to user ${userId}:`, { title, body, data })

      // 模拟成功发送
      return true
    } catch (error) {
      console.error(`Failed to send push notification to user ${userId}:`, error)
      return false
    }
  }

  // 获取VAPID公钥
  public getPublicKey(): string {
    return this.vapidKeys.publicKey
  }
}

// 通知服务
export class NotificationService {
  private pushService = PushNotificationService.getInstance()

  // 发送工作流通知
  public async sendWorkflowNotification(notification: NotificationRecord, userId: string): Promise<boolean> {
    let title = "工作流通知"
    const body = notification.message
    let icon = "/icons/workflow-icon.png"
    const badge = "/icons/badge-icon.png"

    // 根据通知类型设置不同的标题和图标
    switch (notification.type) {
      case "reminder":
        title = "任务提醒"
        icon = "/icons/reminder-icon.png"
        break
      case "escalation":
        title = "任务升级"
        icon = "/icons/escalation-icon.png"
        break
      case "warning":
        title = "紧急警告"
        icon = "/icons/warning-icon.png"
        break
      case "completion":
        title = "任务完成"
        icon = "/icons/completion-icon.png"
        break
    }

    return this.pushService.sendNotification(userId, title, body, {
      notificationId: notification.id,
      taskId: notification.taskId,
      type: notification.type,
      url: `/workflow?task=${notification.taskId}`,
      icon,
      badge,
    })
  }

  // 注册推送订阅
  public async registerPushSubscription(userId: string, subscription: PushSubscription): Promise<void> {
    return this.pushService.subscribe(userId, subscription)
  }

  // 取消推送订阅
  public async unregisterPushSubscription(userId: string): Promise<void> {
    return this.pushService.unsubscribe(userId)
  }

  // 获取VAPID公钥
  public getPublicKey(): string {
    return this.pushService.getPublicKey()
  }
}

export const notificationService = new NotificationService()
