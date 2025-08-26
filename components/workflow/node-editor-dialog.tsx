"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { v4 as uuidv4 } from "uuid"
import type { WorkflowNode, PositionLevel } from "@/lib/types/workflow-types"

interface NodeEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  node: WorkflowNode | null
  existingNodes: WorkflowNode[]
  onSave: (node: WorkflowNode) => void
}

export function NodeEditorDialog({ open, onOpenChange, node, existingNodes, onSave }: NodeEditorDialogProps) {
  const [nodeData, setNodeData] = useState<WorkflowNode>({
    id: "",
    title: "",
    description: "",
    category: "日常准备",
    responsibleLevel: "员工",
    timeLimit: 30,
    reminderBefore: 10,
    escalationAfter: 15,
    warningAfter: 30,
  })

  // 初始化节点数据
  useEffect(() => {
    if (node) {
      setNodeData({ ...node })
    } else {
      setNodeData({
        id: uuidv4(),
        title: "",
        description: "",
        category: "日常准备",
        responsibleLevel: "员工",
        timeLimit: 30,
        reminderBefore: 10,
        escalationAfter: 15,
        warningAfter: 30,
      })
    }
  }, [node, open])

  // 处理节点属性变更
  const handleNodeChange = (property: keyof WorkflowNode, value: any) => {
    setNodeData((prev) => ({
      ...prev,
      [property]: value,
    }))
  }

  // 处理依赖关系变更
  const handleDependencyChange = (nodeId: string, checked: boolean) => {
    let dependencies = nodeData.dependsOn || []

    if (checked) {
      dependencies = [...dependencies, nodeId]
    } else {
      dependencies = dependencies.filter((id) => id !== nodeId)
    }

    setNodeData((prev) => ({
      ...prev,
      dependsOn: dependencies,
    }))
  }

  // 保存节点
  const handleSave = () => {
    // 验证必填项
    if (!nodeData.title.trim()) {
      alert("请填写节点标题")
      return
    }

    // 验证时间设置
    if (nodeData.reminderBefore >= nodeData.timeLimit) {
      alert("提前提醒时间必须小于时间限制")
      return
    }

    if (nodeData.escalationAfter <= 0) {
      alert("升级时间必须大于0")
      return
    }

    if (nodeData.warningAfter <= nodeData.escalationAfter) {
      alert("警告时间必须大于升级时间")
      return
    }

    onSave(nodeData)
  }

  // 可选的依赖节点（排除当前节点和可能导致循环依赖的节点）
  const availableDependencies = existingNodes.filter((n) => n.id !== nodeData.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{node ? "编辑节点" : "添加节点"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">节点标题</Label>
              <Input
                id="title"
                value={nodeData.title}
                onChange={(e) => handleNodeChange("title", e.target.value)}
                placeholder="例如：上班前准备"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">节点描述</Label>
              <Textarea
                id="description"
                value={nodeData.description}
                onChange={(e) => handleNodeChange("description", e.target.value)}
                placeholder="例如：员工上班前准备工作，包括着装整齐、仪容仪表检查等"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Select value={nodeData.category} onValueChange={(value) => handleNodeChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="日常准备">日常准备</SelectItem>
                    <SelectItem value="会议">会议</SelectItem>
                    <SelectItem value="检查">检查</SelectItem>
                    <SelectItem value="交接">交接</SelectItem>
                    <SelectItem value="报表">报表</SelectItem>
                    <SelectItem value="盘点">盘点</SelectItem>
                    <SelectItem value="审核">审核</SelectItem>
                    <SelectItem value="其他">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibleLevel">负责岗位</Label>
                <Select
                  value={nodeData.responsibleLevel}
                  onValueChange={(value) => handleNodeChange("responsibleLevel", value as PositionLevel)}
                >
                  <SelectTrigger id="responsibleLevel">
                    <SelectValue placeholder="选择负责岗位" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="员工">员工</SelectItem>
                    <SelectItem value="直属管理">直属管理</SelectItem>
                    <SelectItem value="门店副总">门店副总</SelectItem>
                    <SelectItem value="总经理">总经理</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeLimit">时间限制（分钟）</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={nodeData.timeLimit}
                  onChange={(e) => handleNodeChange("timeLimit", Number.parseInt(e.target.value) || 0)}
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderBefore">提前提醒（分钟）</Label>
                <Input
                  id="reminderBefore"
                  type="number"
                  value={nodeData.reminderBefore}
                  onChange={(e) => handleNodeChange("reminderBefore", Number.parseInt(e.target.value) || 0)}
                  min={0}
                  max={nodeData.timeLimit - 1}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="escalationAfter">升级时间（分钟）</Label>
                <Input
                  id="escalationAfter"
                  type="number"
                  value={nodeData.escalationAfter}
                  onChange={(e) => handleNodeChange("escalationAfter", Number.parseInt(e.target.value) || 0)}
                  min={1}
                />
                <p className="text-xs text-muted-foreground">超过此时间未完成，任务将升级给上级</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warningAfter">警告时间（分钟）</Label>
                <Input
                  id="warningAfter"
                  type="number"
                  value={nodeData.warningAfter}
                  onChange={(e) => handleNodeChange("warningAfter", Number.parseInt(e.target.value) || 0)}
                  min={nodeData.escalationAfter + 1}
                />
                <p className="text-xs text-muted-foreground">超过此时间未完成，将发出警告通知</p>
              </div>
            </div>

            {availableDependencies.length > 0 && (
              <div className="space-y-2">
                <Label>依赖节点</Label>
                <div className="border rounded-md p-3 space-y-2">
                  <p className="text-xs text-muted-foreground">选择此节点依赖的其他节点（必须先完成这些节点）</p>
                  {availableDependencies.map((depNode) => (
                    <div key={depNode.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dep-${depNode.id}`}
                        checked={(nodeData.dependsOn || []).includes(depNode.id)}
                        onCheckedChange={(checked) => handleDependencyChange(depNode.id, !!checked)}
                      />
                      <Label htmlFor={`dep-${depNode.id}`} className="font-normal">
                        {depNode.title}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>保存节点</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
