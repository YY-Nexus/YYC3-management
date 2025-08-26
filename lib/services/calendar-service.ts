import type { WorkflowInstance, WorkflowTask } from "../types/workflow-types"

// 日历提供商类型
export type CalendarProvider = "google" | "outlook" | "apple" | "other"

// 日历事件接口
export interface CalendarEvent {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  location?: string
  url?: string
  reminders?: number[] // 提前提醒时间（分钟）
}

// 日历集成服务
export class CalendarService {
  // 将工作流任务转换为日历事件
  public convertTaskToEvent(task: WorkflowTask, instance: WorkflowInstance): CalendarEvent {
    // 计算结束时间（开始时间 + 时间限制）
    const startTime = new Date(task.scheduledTime)
    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + this.getTaskDuration(task))

    return {
      id: task.id,
      title: `[${instance.name}] ${task.title}`,
      description: `${task.description}\n\n工作流: ${instance.name}\n状态: ${this.getStatusText(task.status)}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      url: `/workflow?task=${task.id}`,
      reminders: [task.reminderBefore],
    }
  }

  // 获取任务持续时间（分钟）
  private getTaskDuration(task: WorkflowTask): number {
    // 这里简化处理，实际应用中可能需要从节点定义中获取
    return 30 // 默认30分钟
  }

  // 获取状态文本
  private getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pending: "待处理",
      in_progress: "处理中",
      completed: "已完成",
      escalated: "已升级",
      warning: "警告",
      overdue: "已超时",
    }
    return statusMap[status] || status
  }

  // 生成Google日历链接
  public generateGoogleCalendarLink(event: CalendarEvent): string {
    const startTime = new Date(event.startTime)
    const endTime = new Date(event.endTime)

    // 格式化为Google日历所需的格式
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "")
    }

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      details: event.description,
      dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })

    if (event.location) {
      params.append("location", event.location)
    }

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  // 生成Outlook日历链接
  public generateOutlookCalendarLink(event: CalendarEvent): string {
    const startTime = new Date(event.startTime)
    const endTime = new Date(event.endTime)

    // 格式化为Outlook所需的格式
    const formatDate = (date: Date) => {
      return date.toISOString()
    }

    const params = new URLSearchParams({
      path: "/calendar/action/compose",
      rru: "addevent",
      subject: event.title,
      body: event.description,
      startdt: formatDate(startTime),
      enddt: formatDate(endTime),
    })

    if (event.location) {
      params.append("location", event.location)
    }

    return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`
  }

  // 生成iCalendar文件内容
  public generateICalendarContent(event: CalendarEvent): string {
    const startTime = new Date(event.startTime)
    const endTime = new Date(event.endTime)

    // 格式化为iCalendar所需的格式
    const formatDate = (date: Date) => {
      return date
        .toISOString()
        .replace(/-|:|\.\d+/g, "")
        .slice(0, -1)
    }

    const now = formatDate(new Date())

    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//YanYu Cloud OS//Workflow Calendar//CN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${event.id}@yanyu-cloud-os`,
      `DTSTAMP:${now}`,
      `DTSTART:${formatDate(startTime)}`,
      `DTEND:${formatDate(endTime)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    ]

    if (event.location) {
      icsContent.push(`LOCATION:${event.location}`)
    }

    if (event.url) {
      icsContent.push(`URL:${event.url}`)
    }

    // 添加提醒
    if (event.reminders && event.reminders.length > 0) {
      event.reminders.forEach((minutes) => {
        icsContent = icsContent.concat([
          "BEGIN:VALARM",
          "ACTION:DISPLAY",
          `DESCRIPTION:Reminder for ${event.title}`,
          `TRIGGER:-PT${minutes}M`,
          "END:VALARM",
        ])
      })
    }

    icsContent = icsContent.concat(["END:VEVENT", "END:VCALENDAR"])

    return icsContent.join("\r\n")
  }

  // 导出为iCalendar文件
  public exportToICalendar(events: CalendarEvent[]): string {
    const now = new Date()
      .toISOString()
      .replace(/-|:|\.\d+/g, "")
      .slice(0, -1)

    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//YanYu Cloud OS//Workflow Calendar//CN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ]

    events.forEach((event) => {
      const startTime = new Date(event.startTime)
      const endTime = new Date(event.endTime)

      // 格式化为iCalendar所需的格式
      const formatDate = (date: Date) => {
        return date
          .toISOString()
          .replace(/-|:|\.\d+/g, "")
          .slice(0, -1)
      }

      icsContent = icsContent.concat([
        "BEGIN:VEVENT",
        `UID:${event.id}@yanyu-cloud-os`,
        `DTSTAMP:${now}`,
        `DTSTART:${formatDate(startTime)}`,
        `DTEND:${formatDate(endTime)}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
      ])

      if (event.location) {
        icsContent.push(`LOCATION:${event.location}`)
      }

      if (event.url) {
        icsContent.push(`URL:${event.url}`)
      }

      // 添加提醒
      if (event.reminders && event.reminders.length > 0) {
        event.reminders.forEach((minutes) => {
          icsContent = icsContent.concat([
            "BEGIN:VALARM",
            "ACTION:DISPLAY",
            `DESCRIPTION:Reminder for ${event.title}`,
            `TRIGGER:-PT${minutes}M`,
            "END:VALARM",
          ])
        })
      }

      icsContent.push("END:VEVENT")
    })

    icsContent.push("END:VCALENDAR")

    return icsContent.join("\r\n")
  }
}

export const calendarService = new CalendarService()
