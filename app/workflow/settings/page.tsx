"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { NotificationSettings } from "@/components/workflow/notification-settings"
import { CalendarIntegration } from "@/components/workflow/calendar-integration"
import type { WorkflowInstance } from "@/lib/types/workflow-types"

export default function WorkflowSettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("notifications")
  const [instances, setInstances] = useState<WorkflowInstance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 获取工作流实例
  useState(() => {
    async function fetchInstances() {
      try {
        const response = await fetch("/api/workflow/instances")
        const data = await response.json()
        setInstances(data.instances || [])
      } catch (error) {
        console.error("Error fetching workflow instances:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstances()
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/workflow")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">返回</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">工作流设置</h1>
          <p className="text-muted-foreground">配置工作流通知和集成</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
          <TabsTrigger value="calendar">日历集成</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarIntegration instances={instances} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
