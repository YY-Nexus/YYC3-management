"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { AdvancedWorkflowNode } from "@/lib/types/advanced-workflow-types"
import { FormFieldEditor } from "./form-field-editor"

interface NodePropertiesProps {
  node: AdvancedWorkflowNode
  allNodes: AdvancedWorkflowNode[]
  onUpdate: (node: AdvancedWorkflowNode) => void
  isStartNode: boolean
  onSetAsStart: () => void
}

export function NodePropertiesPanel({ node, allNodes, onUpdate, isStartNode, onSetAsStart }: NodePropertiesProps) {
  const [activeTab, setActiveTab] = useState("basic")

  // 处理基本属性变更
  const handleBasicChange = (field: string, value: any) => {
    onUpdate({ ...node, [field]: value })
  }

  // 渲染基本属性表单
  const renderBasicForm = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input id="title" value={node.title || ""} onChange={(e) => handleBasicChange("title", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">描述</Label>
          <Textarea
            id="description"
            value={node.description || ""}
            onChange={(e) => handleBasicChange("description", e.target.value)}
            rows={3}
          />
        </div>

        {node.type === "task" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="category">分类</Label>
              <Select value={node.category || ""} onValueChange={(value) => handleBasicChange("category", value)}>
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
                value={node.responsibleLevel || ""}
                onValueChange={(value) => handleBasicChange("responsibleLevel", value)}
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

            <div className="space-y-2">
              <Label htmlFor="timeLimit">时间限制（分钟）</Label>
              <Input
                id="timeLimit"
                type="number"
                value={node.timeLimit || 0}
                onChange={(e) => handleBasicChange("timeLimit", Number(e.target.value))}
                min={1}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="reminderBefore">提前提醒（分钟）</Label>
                <Input
                  id="reminderBefore"
                  type="number"
                  value={node.reminderBefore || 0}
                  onChange={(e) => handleBasicChange("reminderBefore", Number(e.target.value))}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="escalationAfter">升级时间（分钟）</Label>
                <Input
                  id="escalationAfter"
                  type="number"
                  value={node.escalationAfter || 0}
                  onChange={(e) => handleBasicChange("escalationAfter", Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
          </>
        )}

        {isStartNode ? (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">起始节点</Badge>
        ) : (
          <Button variant="outline" size="sm" onClick={onSetAsStart}>
            设为起始节点
          </Button>
        )}
      </div>
    )
  }

  // 渲染条件属性表单
  const renderConditionForm = () => {
    if (node.type !== "condition") return null

    return (
      <div className="space-y-4">
        <div className="p-3 bg-yellow-50 rounded-md">
          <p className="text-xs text-yellow-800">条件节点允许根据表单数据或工作流变量进行判断，并决定执行路径。</p>
        </div>

        <div className="space-y-2">
          <Label>条件表达式</Label>
          <Textarea
            placeholder="例如: formData.approved === true"
            value={node.condition ? JSON.stringify(node.condition, null, 2) : ""}
            onChange={(e) => {
              try {
                const condition = JSON.parse(e.target.value)
                handleBasicChange("condition", condition)
              } catch (error) {
                // 解析错误，不更新
              }
            }}
            rows={4}
          />
          <p className="text-xs text-gray-500">
            使用JSON格式定义条件。支持访问表单数据(formData)和工作流变量(variables)。
          </p>
        </div>
      </div>
    )
  }

  // 渲染循环属性表单
  const renderLoopForm = () => {
    if (node.type !== "loop_start") return null

    return (
      <div className="space-y-4">
        <div className="p-3 bg-green-50 rounded-md">
          <p className="text-xs text-green-800">
            循环节点允许重复执行一系列任务，直到满足退出条件。需要与循环结束节点配对使用。
          </p>
        </div>

        <div className="space-y-2">
          <Label>循环条件</Label>
          <Textarea
            placeholder="例如: { field: 'index', operator: 'less_than', value: 10 }"
            value={node.loopCondition ? JSON.stringify(node.loopCondition, null, 2) : ""}
            onChange={(e) => {
              try {
                const loopCondition = JSON.parse(e.target.value)
                handleBasicChange("loopCondition", loopCondition)
              } catch (error) {
                // 解析错误，不更新
              }
            }}
            rows={4}
          />
          <p className="text-xs text-gray-500">使用JSON格式定义循环条件。支持访问工作流变量(variables)。</p>
        </div>
      </div>
    )
  }

  // 渲染表单字段编辑器
  const renderFormFields = () => {
    if (node.type !== "task") return null

    return (
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-800">为任务节点添加表单字段，用户需要填写这些字段才能完成任务。</p>
        </div>

        <FormFieldEditor
          fields={node.formFields || []}
          onChange={(fields) => handleBasicChange("formFields", fields)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="basic" className="flex-1">
            基本信息
          </TabsTrigger>
          {(node.type === "condition" || node.type === "loop_start") && (
            <TabsTrigger value="logic" className="flex-1">
              逻辑设置
            </TabsTrigger>
          )}
          {node.type === "task" && (
            <TabsTrigger value="form" className="flex-1">
              表单字段
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="basic" className="pt-4">
          {renderBasicForm()}
        </TabsContent>

        <TabsContent value="logic" className="pt-4">
          {node.type === "condition" && renderConditionForm()}
          {node.type === "loop_start" && renderLoopForm()}
        </TabsContent>

        <TabsContent value="form" className="pt-4">
          {renderFormFields()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
