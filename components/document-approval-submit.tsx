"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { FileText, Send, Save, X } from "lucide-react"

interface DocumentApprovalSubmitProps {
  documentId: string
  documentTitle: string
  documentType: string
  onClose: () => void
  onSuccess: () => void
}

export function DocumentApprovalSubmit({
  documentId,
  documentTitle,
  documentType,
  onClose,
  onSuccess,
}: DocumentApprovalSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [approvalFlow, setApprovalFlow] = useState("default_flow")
  const [urgency, setUrgency] = useState("normal")
  const [comment, setComment] = useState("")
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([])
  const [selectedCc, setSelectedCc] = useState<string[]>([])
  const [dueDate, setDueDate] = useState("")
  const { toast } = useToast()

  // 模拟审批流程数据
  const approvalFlows = [
    { id: "default_flow", name: "标准文档审批流程" },
    { id: "urgent_flow", name: "紧急文档审批流程" },
    { id: "contract_flow", name: "合同文档审批流程" },
  ]

  // 模拟审批人数据
  const approvers = [
    { id: "user1", name: "李经理", department: "技术部", avatar: "" },
    { id: "user2", name: "王总监", department: "产品部", avatar: "" },
    { id: "user3", name: "张总经理", department: "总经办", avatar: "" },
    { id: "user4", name: "赵主管", department: "市场部", avatar: "" },
  ]

  // 提交审批
  const handleSubmit = () => {
    if (selectedApprovers.length === 0) {
      toast({
        title: "提交失败",
        description: "请至少选择一个审批人",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // 模拟提交审批
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "提交成功",
        description: "文档已成功提交审批",
      })
      onSuccess()
    }, 1500)
  }

  // 添加审批人
  const addApprover = (id: string) => {
    if (!selectedApprovers.includes(id)) {
      setSelectedApprovers([...selectedApprovers, id])
    }
  }

  // 移除审批人
  const removeApprover = (id: string) => {
    setSelectedApprovers(selectedApprovers.filter((approverId) => approverId !== id))
  }

  // 添加抄送人
  const addCc = (id: string) => {
    if (!selectedCc.includes(id)) {
      setSelectedCc([...selectedCc, id])
    }
  }

  // 移除抄送人
  const removeCc = (id: string) => {
    setSelectedCc(selectedCc.filter((ccId) => ccId !== id))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>提交文档审批</CardTitle>
            <CardDescription>将文档提交给相关人员进行审批</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-md bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{documentTitle}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{documentType}</Badge>
                <span className="text-xs text-muted-foreground">文档ID: {documentId}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="approval-flow">审批流程</Label>
            <Select value={approvalFlow} onValueChange={setApprovalFlow}>
              <SelectTrigger id="approval-flow">
                <SelectValue placeholder="选择审批流程" />
              </SelectTrigger>
              <SelectContent>
                {approvalFlows.map((flow) => (
                  <SelectItem key={flow.id} value={flow.id}>
                    {flow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="urgency">紧急程度</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger id="urgency">
                <SelectValue placeholder="选择紧急程度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">低</SelectItem>
                <SelectItem value="normal">普通</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="urgent">紧急</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="due-date">截止日期</Label>
            <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="comment">审批说明</Label>
            <Textarea
              id="comment"
              placeholder="请输入审批说明..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">审批人</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedApprovers.map((id) => {
                const approver = approvers.find((a) => a.id === id)
                return (
                  <Badge key={id} variant="secondary" className="flex items-center gap-1 p-1 pl-2">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarFallback>{approver?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {approver?.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => removeApprover(id)}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                )
              })}
              {selectedApprovers.length === 0 && <div className="text-sm text-muted-foreground">请选择审批人</div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {approvers.map((approver) => (
                <div
                  key={approver.id}
                  className={`flex items-center p-2 border rounded-md cursor-pointer transition-colors ${
                    selectedApprovers.includes(approver.id) ? "bg-primary/10 border-primary" : "hover:bg-muted/20"
                  }`}
                  onClick={() => addApprover(approver.id)}
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>{approver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{approver.name}</p>
                    <p className="text-xs text-muted-foreground">{approver.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">抄送人</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedCc.map((id) => {
                const cc = approvers.find((a) => a.id === id)
                return (
                  <Badge key={id} variant="outline" className="flex items-center gap-1 p-1 pl-2">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarFallback>{cc?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {cc?.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => removeCc(id)}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                )
              })}
              {selectedCc.length === 0 && <div className="text-sm text-muted-foreground">可选择抄送人</div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {approvers.map((approver) => (
                <div
                  key={approver.id}
                  className={`flex items-center p-2 border rounded-md cursor-pointer transition-colors ${
                    selectedCc.includes(approver.id) ? "bg-primary/10 border-primary" : "hover:bg-muted/20"
                  }`}
                  onClick={() => addCc(approver.id)}
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>{approver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{approver.name}</p>
                    <p className="text-xs text-muted-foreground">{approver.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          取消
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save size={16} className="mr-1" />
            保存草稿
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Send size={16} className="mr-1" />
            {isSubmitting ? "提交中..." : "提交审批"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
