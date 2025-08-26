"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Users, Coffee } from "lucide-react"
import { BusinessClubOrganization } from "@/components/business-club-organization"
import { PositionDetails } from "@/components/position-details"
import { ThemeRoomManagement } from "@/components/theme-room-management"

export default function BusinessClubPage() {
  const [activeTab, setActiveTab] = useState("organization")

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">商务会所管理系统</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="organization" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            <span>组织架构</span>
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>岗位详情</span>
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center gap-1">
            <Coffee className="h-4 w-4" />
            <span>主题包间</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization">
          <BusinessClubOrganization />
        </TabsContent>

        <TabsContent value="positions">
          <PositionDetails />
        </TabsContent>

        <TabsContent value="rooms">
          <ThemeRoomManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
