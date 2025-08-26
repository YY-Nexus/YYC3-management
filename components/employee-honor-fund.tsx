"use client"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// 员工荣誉基金数据
const honorFundData = [
  {
    id: 1,
    name: "张明",
    department: "研发部",
    points: 850,
    maxPoints: 1000,
    avatar: "/chinese-character-zhang.png",
    badges: ["创新之星", "技术精英"],
  },
  {
    id: 2,
    name: "李华",
    department: "市场部",
    points: 720,
    maxPoints: 1000,
    avatar: "/chinese-character-li.png",
    badges: ["销售冠军"],
  },
  {
    id: 3,
    name: "王芳",
    department: "客服部",
    points: 680,
    maxPoints: 1000,
    avatar: "/chinese-character-wang.png",
    badges: ["服务之星"],
  },
]

export function EmployeeHonorFund() {
  return (
    <div className="space-y-4">
      {honorFundData.map((employee) => (
        <div
          key={employee.id}
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Avatar className="h-10 w-10 border-2 border-purple-200">
            <img src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium truncate">{employee.name}</p>
                <p className="text-xs text-gray-500 truncate">{employee.department}</p>
              </div>
              <div className="text-sm font-semibold">
                {employee.points}/{employee.maxPoints}
              </div>
            </div>
            <Progress value={(employee.points / employee.maxPoints) * 100} className="h-2 mt-1" />
            <div className="flex flex-wrap gap-1 mt-1">
              {employee.badges.map((badge, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="text-center mt-2">
        <p className="text-xs text-gray-500">荣誉基金可用于兑换奖品、福利或特权</p>
      </div>
    </div>
  )
}
