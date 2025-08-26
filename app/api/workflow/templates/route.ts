import { NextResponse } from "next/server"
import { getWorkflowTemplates, getWorkflowTemplate } from "@/lib/services/workflow-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const template = await getWorkflowTemplate(id)
      if (!template) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 })
      }
      return NextResponse.json({ template })
    }

    const templates = await getWorkflowTemplates()
    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Error fetching workflow templates:", error)
    return NextResponse.json({ error: "Failed to fetch workflow templates" }, { status: 500 })
  }
}
