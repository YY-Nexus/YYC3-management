"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Calendar, Download, ExternalLink } from "lucide-react"
import type { WorkflowInstance, WorkflowTask } from "@/lib/types/workflow-types"
import { calendarService, type CalendarEvent, type CalendarProvider } from "@/lib/services/calendar-service"

interface CalendarIntegrationProps {
  instances: WorkflowInstance[]
}

export function CalendarIntegration({ instances }: CalendarIntegrationProps) {
  const [activeTab, setActiveTab] = useState<CalendarProvider>("google")
  const [selectedInstance, setSelectedInstance] = useState<string>("all")
  const [includeCompleted, setIncludeCompleted] = useState(false)
  const [calendarName, setCalendarName] = useState("工作流任务")
  const [calendarColor, setCalendarColor] = useState("#4285F4")

  // 获取所有任务
  const getTasks = (): { task: WorkflowTask; instance: WorkflowInstance }[] => {
    const tasks: { task: WorkflowTask; instance: WorkflowInstance }[] = []

    instances.forEach((instance) => {
      if (selectedInstance !== "all" && instance.id !== selectedInstance) {
        return
      }

      instance.tasks.forEach((task) => {
        if (!includeCompleted && task.status === "completed") {
          return
        }

        tasks.push({ task, instance })
      })
    })

    return tasks
  }

  // 转换为日历事件
  const getCalendarEvents = (): CalendarEvent[] => {
    const tasks = getTasks()
    return tasks.map(({ task, instance }) => calendarService.convertTaskToEvent(task, instance))
  }

  // 导出为iCalendar文件
  const exportToICalendar = () => {
    const events = getCalendarEvents()
    const icsContent = calendarService.exportToICalendar(events)

    // 创建Blob并下载
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${calendarName}.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 获取Google日历链接
  const getGoogleCalendarLink = (event: CalendarEvent): string => {
    return calendarService.generateGoogleCalendarLink(event)
  }

  // 获取Outlook日历链接
  const getOutlookCalendarLink = (event: CalendarEvent): string => {
    return calendarService.generateOutlookCalendarLink(event)
  }

  // 获取Apple日历链接（实际上是下载iCalendar文件）
  const getAppleCalendarLink = (event: CalendarEvent): string => {
    const icsContent = calendarService.generateICalendarContent(event)
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    return URL.createObjectURL(blob)
  }

  const events = getCalendarEvents()

  return (
    <Card>
      <CardHeader>
        <CardTitle>日历集成</CardTitle>
        <CardDescription>将工作流任务与您的日历系统集成</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instance-select">选择工作流</Label>
              <Select value={selectedInstance} onValueChange={setSelectedInstance}>
                <SelectTrigger id="instance-select">
                  <SelectValue placeholder="选择工作流" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有工作流</SelectItem>
                  {instances.map((instance) => (
                    <SelectItem key={instance.id} value={instance.id}>
                      {instance.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calendar-name">日历名称</Label>
              <Input
                id="calendar-name"
                value={calendarName}
                onChange={(e) => setCalendarName(e.target.value)}
                placeholder="输入日历名称"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="include-completed" checked={includeCompleted} onCheckedChange={setIncludeCompleted} />
            <Label htmlFor="include-completed">包含已完成的任务</Label>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CalendarProvider)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="google">Google 日历</TabsTrigger>
            <TabsTrigger value="outlook">Outlook 日历</TabsTrigger>
            <TabsTrigger value="apple">Apple 日历</TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                Google 日历集成
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                点击下方的"添加到Google日历"按钮，将任务添加到您的Google日历中。
              </p>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={exportToICalendar}>
                <Download className="mr-2 h-4 w-4" />
                导出为iCalendar文件
              </Button>

              <p className="text-xs text-muted-foreground text-center">或者</p>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">没有符合条件的任务</p>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.startTime).toLocaleString("zh-CN")} -{" "}
                            {new Date(event.endTime).toLocaleString("zh-CN")}
                          </p>
                        </div>
                        <a
                          href={getGoogleCalendarLink(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">添加到Google日历</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="outlook" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                Outlook 日历集成
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                点击下方的"添加到Outlook日历"按钮，将任务添加到您的Outlook日历中。
              </p>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={exportToICalendar}>
                <Download className="mr-2 h-4 w-4" />
                导出为iCalendar文件
              </Button>

              <p className="text-xs text-muted-foreground text-center">或者</p>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">没有符合条件的任务</p>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.startTime).toLocaleString("zh-CN")} -{" "}
                            {new Date(event.endTime).toLocaleString("zh-CN")}
                          </p>
                        </div>
                        <a
                          href={getOutlookCalendarLink(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">添加到Outlook日历</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apple" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                Apple 日历集成
              </h3>
              <p className="text-sm text-muted-foreground mt-1">下载iCalendar文件，然后导入到您的Apple日历中。</p>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={exportToICalendar}>
                <Download className="mr-2 h-4 w-4" />
                导出为iCalendar文件
              </Button>

              <p className="text-xs text-muted-foreground text-center">或者</p>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">没有符合条件的任务</p>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.startTime).toLocaleString("zh-CN")} -{" "}
                            {new Date(event.endTime).toLocaleString("zh-CN")}
                          </p>
                        </div>
                        <a
                          href={getAppleCalendarLink(event)}
                          download={`${event.title}.ics`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">下载iCalendar文件</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">共 {events.length} 个任务</p>
        <Button onClick={exportToICalendar}>
          <Download className="mr-2 h-4 w-4" />
          导出全部任务
        </Button>
      </CardFooter>
    </Card>
  )
}
