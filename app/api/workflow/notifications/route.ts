import { NextResponse } from "next/server"
import { getUserNotifications, markNotificationAsRead } from "@/lib/services/workflow-service"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const position = searchParams.get("position")

    if (!position) {
      return NextResponse.json({ error: "Position parameter is required" }, { status: 400 })
    }

    const notifications = await getUserNotifications(position as any)
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 })
    }

    const notification = await markNotificationAsRead(id)

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json({ notification })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
  }
}
