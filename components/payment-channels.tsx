"use client"

import { Card } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

// 支付渠道数据
const paymentData = [
  { name: "微信支付", value: 4300, color: "#07C160" },
  { name: "支付宝", value: 3800, color: "#1677FF" },
  { name: "银联", value: 2500, color: "#E60012" },
  { name: "企业账户", value: 1800, color: "#6941C6" },
  { name: "其他", value: 800, color: "#9E9E9E" },
]

export function PaymentChannels() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">支付渠道分布</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} 元`, "金额"]} labelFormatter={(name) => `渠道: ${name}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">渠道使用统计</h3>
        <div className="space-y-4">
          {paymentData.map((channel) => (
            <div key={channel.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: channel.color }}></div>
                <span>{channel.name}</span>
              </div>
              <div className="font-medium">¥{channel.value.toLocaleString()}</div>
            </div>
          ))}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between font-medium">
              <span>总计</span>
              <span>¥{paymentData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
