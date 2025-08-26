import { NextResponse } from "next/server"
import { updateTaskStatus } from "@/lib/services/workflow-service"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { instanceId, status, notes } = await req.json()
    const taskId = params.id

    if (!instanceId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const task = await updateTaskStatus(instanceId, taskId, status, notes)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error updating task status:", error)
    return NextResponse.json({ error: "Failed to update task status" }, { status: 500 })
  }
}
