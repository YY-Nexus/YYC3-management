import { NextResponse } from "next/server"
import { checkOverdueTasks, initializeExampleData } from "@/lib/services/workflow-service"

export async function POST() {
  try {
    await checkOverdueTasks()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error checking overdue tasks:", error)
    return NextResponse.json({ error: "Failed to check overdue tasks" }, { status: 500 })
  }
}

// 初始化示例数据的API
export async function GET() {
  try {
    await initializeExampleData()
    return NextResponse.json({ success: true, message: "Example data initialized" })
  } catch (error) {
    console.error("Error initializing example data:", error)
    return NextResponse.json({ error: "Failed to initialize example data" }, { status: 500 })
  }
}
