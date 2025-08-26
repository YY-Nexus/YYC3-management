"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TemplateSelectorDialog } from "@/components/approval/template-selector-dialog"
import { TemplateForm } from "@/components/approval/template-form"
import type { ApprovalTemplate } from "@/data/approval-templates"
import { FileText, Plus, ArrowLeft } from "lucide-react"

export default function NewApprovalPage() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ApprovalTemplate | null>(null)

  // 处理模板选择
  const handleSelectTemplate = (template: ApprovalTemplate) => {
    setSelectedTemplate(template)
    setIsDialogOpen(false)
  }

  // 处理表单提交
  const handleSubmitForm = (formData: Record<string, any>) => {
    // 在实际应用中，这里应该调用API提交表单数据
    console.log("提交审批表单:", formData)

    // 提交成功后跳转到审批列表页面
    router.push("/approval")
  }

  // 处理取消
  const handleCancel = () => {
    if (selectedTemplate) {
      // 如果已选择模板，则返回到模板选择
      setSelectedTemplate(null)
    } else {
      // 否则返回到审批列表页面
      router.push("/approval")
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">返回</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">新建审批</h1>
            <p className="text-muted-foreground">创建新的审批申请</p>
          </div>
        </div>

        {selectedTemplate ? (
          <TemplateForm template={selectedTemplate} onSubmit={handleSubmitForm} onCancel={handleCancel} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              className="cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => setIsDialogOpen(true)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-[200px]">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">选择审批模板</h3>
                <p className="text-sm text-muted-foreground">从预设模板中选择，快速创建审批</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => router.push("/approval/custom")}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-[200px]">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">自定义审批</h3>
                <p className="text-sm text-muted-foreground">创建自定义审批流程</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <TemplateSelectorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  )
}
