import { NextResponse } from "next/server"
import { updateTaskStatus, escalateTask } from "@/lib/services/workflow-service"

export async function PUT(req: Request) {
  try {
    const { instanceId, taskId, status, notes } = await req.json()

    if (!instanceId || !taskId || !status) {
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

export async function POST(req: Request) {
  try {
    const { instanceId, taskId, newAssignee } = await req.json()

    if (!instanceId || !taskId || !newAssignee) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const task = await escalateTask(instanceId, taskId, newAssignee)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error escalating task:", error)
    return NextResponse.json({ error: "Failed to escalate task" }, { status: 500 })
  }
}
