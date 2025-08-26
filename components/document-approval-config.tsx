"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  UserCheck,
  Workflow,
  Users,
  Check,
  Save,
  Copy,
  FileText,
  Settings,
} from "lucide-react"

// 审批流程节点类型
type ApprovalNode = {
  id: string
  type: "approver" | "condition" | "cc" | "end"
  name: string
  approvers?: string[]
  conditions?: { field: string; operator: string; value: string }[]
  cc?: string[]
}

// 文档类型
type DocumentType = {
  id: string
  name: string
  needApproval: boolean
  approvalFlow: string | null
}

export function DocumentApprovalConfig() {
  const [activeTab, setActiveTab] = useState("flows")
  const [selectedFlow, setSelectedFlow] = useState("default_flow")
  const [flowName, setFlowName] = useState("标准文档审批流程")

  // 模拟审批流程数据
  const [flows, setFlows] = useState([
    { id: "default_flow", name: "标准文档审批流程" },
    { id: "urgent_flow", name: "紧急文档审批流程" },
    { id: "contract_flow", name: "合同文档审批流程" },
  ])

  // 模拟文档类型数据
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([
    { id: "general", name: "通用文档", needApproval: true, approvalFlow: "default_flow" },
    { id: "report", name: "报告", needApproval: true, approvalFlow: "default_flow" },
    { id: "contract", name: "合同", needApproval: true, approvalFlow: "contract_flow" },
    { id: "notice", name: "通知", needApproval: false, approvalFlow: null },
    { id: "guide", name: "指南手册", needApproval: false, approvalFlow: null },
  ])

  // 模拟审批节点数据
  const [nodes, setNodes] = useState<ApprovalNode[]>([
    {
      id: "node-1",
      type: "approver",
      name: "部门经理审批",
      approvers: ["李经理"],
    },
    {
      id: "node-2",
      type: "condition",
      name: "条件分支",
      conditions: [{ field: "importance", operator: "=", value: "高" }],
    },
    {
      id: "node-3",
      type: "approver",
      name: "总监审批",
      approvers: ["王总监"],
    },
    {
      id: "node-4",
      type: "cc",
      name: "抄送相关部门",
      cc: ["人力资源部", "财务部"],
    },
    {
      id: "node-5",
      type: "end",
      name: "结束",
    },
  ])

  // 添加节点
  const addNode = (type: ApprovalNode["type"]) => {
    const newNode: ApprovalNode = {
      id: `node-${nodes.length + 1}`,
      type,
      name: type === "approver" ? "审批人" : type === "condition" ? "条件分支" : type === "cc" ? "抄送" : "结束",
    }

    if (type === "approver") {
      newNode.approvers = []
    } else if (type === "condition") {
      newNode.conditions = [{ field: "", operator: "", value: "" }]
    } else if (type === "cc") {
      newNode.cc = []
    }

    setNodes([...nodes, newNode])
  }

  // 删除节点
  const removeNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id))
  }

  // 移动节点
  const moveNode = (id: string, direction: "up" | "down") => {
    const index = nodes.findIndex((node) => node.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === nodes.length - 1)) {
      return
    }

    const newNodes = [...nodes]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    const temp = newNodes[index]
    newNodes[index] = newNodes[targetIndex]
    newNodes[targetIndex] = temp

    setNodes(newNodes)
  }

  // 更新节点名称
  const updateNodeName = (id: string, name: string) => {
    setNodes(nodes.map((node) => (node.id === id ? { ...node, name } : node)))
  }

  // 更新文档类型审批设置
  const updateDocumentTypeApproval = (id: string, needApproval: boolean, approvalFlow: string | null) => {
    setDocumentTypes(
      documentTypes.map((type) =>
        type.id === id ? { ...type, needApproval, approvalFlow: needApproval ? approvalFlow : null } : type,
      ),
    )
  }

  // 获取节点图标
  const getNodeIcon = (type: ApprovalNode["type"]) => {
    switch (type) {
      case "approver":
        return <UserCheck className="h-5 w-5" />
      case "condition":
        return <Workflow className="h-5 w-5" />
      case "cc":
        return <Users className="h-5 w-5" />
      case "end":
        return <Check className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">文档审批配置</h1>
          <p className="text-muted-foreground">配置文档审批流程和规则</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Settings size={16} />
            <span className="hidden md:inline">高级设置</span>
          </Button>
          <Button className="gap-1">
            <Save size={16} />
            <span className="hidden md:inline">保存配置</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="flows" className="flex items-center gap-1">
            <Workflow size={16} />
            审批流程
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-1">
            <FileText size={16} />
            文档类型
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings size={16} />
            审批设置
          </TabsTrigger>
        </TabsList>

        {/* 审批流程配置 */}
        <TabsContent value="flows">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>审批流程列表</CardTitle>
                  <CardDescription>选择或创建审批流程</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {flows.map((flow) => (
                    <div
                      key={flow.id}
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedFlow === flow.id ? "bg-primary/10 border-primary" : "hover:bg-muted/20"
                      }`}
                      onClick={() => {
                        setSelectedFlow(flow.id)
                        setFlowName(flow.name)
                      }}
                    >
                      <div className="mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Workflow size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">{flow.name}</h3>
                        <p className="text-xs text-muted-foreground">流程ID: {flow.id}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2">
                    <Plus size={16} className="mr-1" />
                    创建新流程
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle>流程设计</CardTitle>
                      <CardDescription>设计和配置审批流程节点</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="流程名称"
                        value={flowName}
                        onChange={(e) => setFlowName(e.target.value)}
                        className="w-full md:w-[250px]"
                      />
                      <Button variant="outline" size="icon">
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-[180px] space-y-2">
                      <p className="text-sm font-medium mb-2">添加节点</p>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => addNode("approver")}
                      >
                        <UserCheck size={16} />
                        审批人
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => addNode("condition")}
                      >
                        <Workflow size={16} />
                        条件分支
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => addNode("cc")}>
                        <Users size={16} />
                        抄送人
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => addNode("end")}>
                        <Check size={16} />
                        结束节点
                      </Button>
                    </div>

                    <div className="flex-1">
                      <div className="space-y-4">
                        <div className="flex items-center justify-center p-3 bg-primary/10 rounded-md">
                          <Badge className="bg-primary">发起人</Badge>
                        </div>

                        {nodes.map((node, index) => (
                          <div key={node.id} className="relative">
                            <div className="absolute left-1/2 -top-4 w-px h-4 bg-muted-foreground/20"></div>

                            <Card className="relative">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      {getNodeIcon(node.type)}
                                    </div>
                                    <Input
                                      value={node.name}
                                      onChange={(e) => updateNodeName(node.id, e.target.value)}
                                      className="h-8 w-[200px]"
                                    />
                                    <Badge variant="outline">
                                      {node.type === "approver"
                                        ? "审批节点"
                                        : node.type === "condition"
                                          ? "条件节点"
                                          : node.type === "cc"
                                            ? "抄送节点"
                                            : "结束节点"}
                                    </Badge>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => moveNode(node.id, "up")}
                                      disabled={index === 0}
                                    >
                                      <MoveUp size={16} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => moveNode(node.id, "down")}
                                      disabled={index === nodes.length - 1}
                                    >
                                      <MoveDown size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => removeNode(node.id)}>
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </div>

                                {node.type === "approver" && (
                                  <div className="pl-10 mt-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <UserCheck size={16} className="text-muted-foreground" />
                                      <span className="text-sm font-medium">审批人</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {node.approvers &&
                                        node.approvers.map((approver, i) => (
                                          <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                            {approver}
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-4 w-4 ml-1 hover:bg-transparent"
                                            >
                                              <Trash2 size={12} />
                                            </Button>
                                          </Badge>
                                        ))}
                                      <Button variant="outline" size="sm" className="h-6">
                                        <Plus size={14} className="mr-1" />
                                        添加审批人
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {node.type === "condition" && (
                                  <div className="pl-10 mt-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Workflow size={16} className="text-muted-foreground" />
                                      <span className="text-sm font-medium">条件设置</span>
                                    </div>
                                    <div className="space-y-2">
                                      {node.conditions &&
                                        node.conditions.map((condition, i) => (
                                          <div key={i} className="flex items-center gap-2">
                                            <Select value={condition.field} onValueChange={() => {}}>
                                              <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="选择字段" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="importance">重要程度</SelectItem>
                                                <SelectItem value="type">文档类型</SelectItem>
                                                <SelectItem value="department">所属部门</SelectItem>
                                              </SelectContent>
                                            </Select>

                                            <Select value={condition.operator} onValueChange={() => {}}>
                                              <SelectTrigger className="w-[80px]">
                                                <SelectValue placeholder="条件" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="=">=</SelectItem>
                                                <SelectItem value="!=">!=</SelectItem>
                                                <SelectItem value="contains">包含</SelectItem>
                                              </SelectContent>
                                            </Select>

                                            <Input
                                              value={condition.value}
                                              onChange={() => {}}
                                              className="w-[120px]"
                                              placeholder="值"
                                            />

                                            <Button variant="ghost" size="icon">
                                              <Trash2 size={16} />
                                            </Button>
                                          </div>
                                        ))}

                                      <Button variant="outline" size="sm">
                                        <Plus size={14} className="mr-1" />
                                        添加条件
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {node.type === "cc" && (
                                  <div className="pl-10 mt-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Users size={16} className="text-muted-foreground" />
                                      <span className="text-sm font-medium">抄送人</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {node.cc &&
                                        node.cc.map((cc, i) => (
                                          <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                            {cc}
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-4 w-4 ml-1 hover:bg-transparent"
                                            >
                                              <Trash2 size={12} />
                                            </Button>
                                          </Badge>
                                        ))}
                                      <Button variant="outline" size="sm" className="h-6">
                                        <Plus size={14} className="mr-1" />
                                        添加抄送人
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {index < nodes.length - 1 && (
                              <div className="absolute left-1/2 -bottom-4 w-px h-4 bg-muted-foreground/20"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">取消</Button>
                  <Button>保存流程</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 文档类型配置 */}
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>文档类型审批配置</CardTitle>
              <CardDescription>配置不同类型文档的审批流程</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentTypes.map((type) => (
                  <div key={type.id} className="p-4 border rounded-md">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium">{type.name}</h3>
                          <p className="text-xs text-muted-foreground">类型ID: {type.id}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`need-approval-${type.id}`}
                            checked={type.needApproval}
                            onCheckedChange={(checked) =>
                              updateDocumentTypeApproval(
                                type.id,
                                checked,
                                checked ? type.approvalFlow || "default_flow" : null,
                              )
                            }
                          />
                          <Label htmlFor={`need-approval-${type.id}`}>需要审批</Label>
                        </div>

                        {type.needApproval && (
                          <Select
                            value={type.approvalFlow || ""}
                            onValueChange={(value) => updateDocumentTypeApproval(type.id, true, value)}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="选择审批流程" />
                            </SelectTrigger>
                            <SelectContent>
                              {flows.map((flow) => (
                                <SelectItem key={flow.id} value={flow.id}>
                                  {flow.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus size={16} className="mr-1" />
                  添加文档类型
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 审批设置 */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>基本设置</CardTitle>
                <CardDescription>配置审批的基本规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>自动提醒</Label>
                    <p className="text-sm text-muted-foreground">审批超时自动提醒相关人员</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>审批超时时间</Label>
                    <p className="text-sm text-muted-foreground">设置审批节点的超时时间</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" value="24" className="w-20" />
                    <span>小时</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>允许加签</Label>
                    <p className="text-sm text-muted-foreground">允许审批人添加其他审批人</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>允许转交</Label>
                    <p className="text-sm text-muted-foreground">允许审批人将审批转交给他人</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>高级设置</CardTitle>
                <CardDescription>配置审批的高级规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>审批撤回</Label>
                    <p className="text-sm text-muted-foreground">允许发起人撤回审批</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>审批退回</Label>
                    <p className="text-sm text-muted-foreground">允许审批人退回审批</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>批量审批</Label>
                    <p className="text-sm text-muted-foreground">允许审批人批量处理审批</p>
                  </div>
                  <Switch checked={false} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>审批委托</Label>
                    <p className="text-sm text-muted-foreground">允许设置审批委托人</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
