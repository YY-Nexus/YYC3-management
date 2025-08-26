"use client"

import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// 团队互动数据
const interactionsData = [
  {
    id: 1,
    from: {
      name: "研发部",
      avatar: "/research-and-development.png",
    },
    to: {
      name: "市场部",
      avatar: "/bustling-market.png",
    },
    type: "文档协作",
    time: "今天 10:30",
    status: "进行中",
  },
  {
    id: 2,
    from: {
      name: "设计部",
      avatar: "/design-concept.png",
    },
    to: {
      name: "产品部",
      avatar: "/products.png",
    },
    type: "需求讨论",
    time: "今天 09:15",
    status: "已完成",
  },
  {
    id: 3,
    from: {
      name: "财务部",
      avatar: "/finance-abstract.png",
    },
    to: {
      name: "人事部",
      avatar: "/renshi-concept.png",
    },
    type: "预算审批",
    time: "昨天 16:45",
    status: "待处理",
  },
]

export function GroupInteractions() {
  return (
    <div className="space-y-3">
      {interactionsData.map((interaction) => (
        <div key={interaction.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center flex-1">
            <Avatar className="h-8 w-8 border-2 border-blue-100">
              <img src={interaction.from.avatar || "/placeholder.svg"} alt={interaction.from.name} />
            </Avatar>
            <div className="mx-2 text-gray-400">→</div>
            <Avatar className="h-8 w-8 border-2 border-blue-100">
              <img src={interaction.to.avatar || "/placeholder.svg"} alt={interaction.to.name} />
            </Avatar>
            <div className="ml-3">
              <div className="text-sm font-medium">
                {interaction.from.name} 与 {interaction.to.name}
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <span>{interaction.type}</span>
                <span className="mx-1">•</span>
                <span>{interaction.time}</span>
              </div>
            </div>
          </div>
          <Badge
            className={`text-xs ${
              interaction.status === "进行中"
                ? "bg-blue-100 text-blue-700"
                : interaction.status === "已完成"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {interaction.status}
          </Badge>
        </div>
      ))}
      <div className="text-center mt-2">
        <p className="text-xs text-gray-500">实时显示部门间的协作与沟通</p>
      </div>
    </div>
  )
}
