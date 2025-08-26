"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, Plus, X, Save, Settings, ArrowUp } from "lucide-react"

export function ApprovalProcessDesigner() {
  const [steps, setSteps] = useState([
    { id: 1, name: "部门经理审批", approver: "部门经理", condition: "all" },
    { id: 2, name: "财务审核", approver: "财务经理", condition: "amount > 1000" },
    { id: 3, name: "总监审批", approver: "总监", condition: "all" },
  ])

  const [newStep, setNewStep] = useState({
    name: "",
    approver: "",
    condition: "all",
  })

  // 添加步骤
  const addStep = () => {
    if (newStep.name && newStep.approver) {
      setSteps([
        ...steps,
        {
          id: steps.length + 1,
          name: newStep.name,
          approver: newStep.approver,
          condition: newStep.condition,
        },
      ])
      setNewStep({
        name: "",
        approver: "",
        condition: "all",
      })
    }
  }

  // 删除步骤
  const removeStep = (id: number) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  // 移动步骤
  const moveStep = (id: number, direction: "up" | "down") => {
    const index = steps.findIndex((step) => step.id === id)
    if ((direction === "up" && index > 0) || (direction === "down" && index < steps.length - 1)) {
      const newSteps = [...steps]
      const temp = newSteps[index]
      if (direction === "up") {
        newSteps[index] = newSteps[index - 1]
        newSteps[index - 1] = temp
      } else {
        newSteps[index] = newSteps[index + 1]
        newSteps[index + 1] = temp
      }
      setSteps(newSteps)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className="h-6 w-6 rounded-full flex items-center justify-center p-0">{index + 1}</Badge>
                        <div>
                          <h3 className="font-medium">{step.name}</h3>
                          <p className="text-sm text-muted-foreground">审批人: {step.approver}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {step.condition !== "all" && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            条件: {step.condition}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveStep(step.id, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                          <span className="sr-only">上移</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveStep(step.id, "down")}
                          disabled={index === steps.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                          <span className="sr-only">下移</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">删除</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowDown className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">步骤名称</label>
                      <Input
                        placeholder="输入步骤名称"
                        value={newStep.name}
                        onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">审批人</label>
                      <Input
                        placeholder="输入审批人"
                        value={newStep.approver}
                        onChange={(e) => setNewStep({ ...newStep, approver: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">条件</label>
                      <Select
                        value={newStep.condition}
                        onValueChange={(value) => setNewStep({ ...newStep, condition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择条件" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有情况</SelectItem>
                          <SelectItem value="amount &gt; 1000">金额 &gt; 1000</SelectItem>
                          <SelectItem value="days &gt; 3">天数 &gt; 3</SelectItem>
                          <SelectItem value="special">特殊情况</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button onClick={addStep} disabled={!newStep.name || !newStep.approver}>
                      <Plus className="mr-2 h-4 w-4" />
                      添加步骤
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">流程预览</h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative pl-6 pb-6">
                    <div className="absolute left-0 top-0 h-full w-px bg-border"></div>
                    <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-primary border-2 border-primary"></div>
                    <div>
                      <p className="font-medium">{step.name}</p>
                      <p className="text-sm text-muted-foreground">审批人: {step.approver}</p>
                      {step.condition !== "all" && (
                        <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                          条件: {step.condition}
                        </Badge>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute left-[-4px] bottom-3">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  高级设置
                </Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  保存流程
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
