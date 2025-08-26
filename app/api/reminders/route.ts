import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { items } = await req.json()
  const now = new Date()
  const reminders = []

  items.forEach((item) => {
    if (!item.completed) {
      const itemDate = new Date(`${item.date}T${item.time}`)
      const timeDiff = now.getTime() - itemDate.getTime()
      const minutesDiff = Math.floor(timeDiff / 60000)

      if (minutesDiff >= 0 && minutesDiff < 1) {
        reminders.push({
          type: "reminder",
          message: `${item.content} 的时间到了！`,
        })
      } else if (minutesDiff >= 15 && minutesDiff < 16 && item.assignedTo === "员工") {
        reminders.push({
          type: "escalation",
          message: `${item.content} 已超时15分钟，已升级至直属管理。`,
          newAssignee: "直属管理",
          itemId: item.id,
        })
      } else if (minutesDiff >= 30 && minutesDiff < 31 && item.assignedTo === "直属管理") {
        reminders.push({
          type: "escalation",
          message: `${item.content} 已超时30分钟，已升级至门店副总。`,
          newAssignee: "门店副总",
          itemId: item.id,
        })
      }
    }
  })

  return NextResponse.json({ reminders })
}
