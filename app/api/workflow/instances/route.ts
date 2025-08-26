import { NextResponse } from "next/server"
import { getWorkflowInstances, createWorkflowInstance, getWorkflowInstance } from "@/lib/services/workflow-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const instance = await getWorkflowInstance(id)
      if (!instance) {
        return NextResponse.json({ error: "Instance not found" }, { status: 404 })
      }
      return NextResponse.json({ instance })
    }

    const instances = await getWorkflowInstances()
    return NextResponse.json({ instances })
  } catch (error) {
    console.error("Error fetching workflow instances:", error)
    return NextResponse.json({ error: "Failed to fetch workflow instances" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { templateId, name, description, startTime, createdBy } = await req.json()

    if (!templateId || !name || !startTime || !createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const instance = await createWorkflowInstance(templateId, name, description || "", startTime, createdBy)

    return NextResponse.json({ instance })
  } catch (error) {
    console.error("Error creating workflow instance:", error)
    return NextResponse.json({ error: "Failed to create workflow instance" }, { status: 500 })
  }
}
