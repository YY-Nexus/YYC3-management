"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { UserCheck, Users, Star, Sparkles, Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Approver = {
  id: string
  name: string
  department: string
  position: string
  avatar: string
  efficiency: number
  approvalRate: number
  expertise: string[]
  recentLoad: number
  availability: "available" | "busy" | "unavailable"
  score?: number
}

type ApprovalFlow = {
  id: string
  name: string
  description: string
  steps: {
    id: string
    name: string
    type: "approver" | "condition" | "cc"
    approvers?: string[]
  }[]
}

export function DocumentApprovalRecommender() {
  const [activeTab, setActiveTab] = useState("approvers")
  const [documentType, setDocumentType] = useState("finance")
  const [urgency, setUrgency] = useState("normal")
  const [department, setDepartment] = useState("all")
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([])
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    considerExpertise: true,
    considerEfficiency: true,
    considerWorkload: true,
    expertiseWeight: 40,
    efficiencyWeight: 30,
    workloadWeight: 30,
  })
  const { toast } = useToast()

  // 模拟审批人数据
  const approvers: Approver[] = [
    {
      id: "user1",
      name: "张经理",
      department: "技术部",
      position: "技术经理",
      avatar: "",
      efficiency: 95,
      approvalRate: 92,
      expertise: ["技术文档", "产品文档"],
      recentLoad: 5,
      availability: "available",
    },
    {
      id: "user2",
      name: "王总监",
      department: "产品部",
      position: "产品总监",
      avatar: "",
      efficiency: 90,
      approvalRate: 88,
      expertise: ["产品文档", "设计文档"],
      recentLoad: 8,
      availability: "busy",
    },
    {
      id: "user3",
      name: "李总经理",
      department: "总经办",
      position: "总经理",
      avatar: "",
      efficiency: 85,
      approvalRate: 80,
      expertise: ["财务报告", "合同文档", "战略规划"],
      recentLoad: 12,
      availability: "busy",
    },
    {
      id: "user4",
      name: "赵主管",
      department: "市场部",
      position: "市场主管",
      avatar: "",
      efficiency: 92,
      approvalRate: 90,
      expertise: ["营销文档", "市场报告"],
      recentLoad: 3,
      availability: "available",
    },
    {
      id: "user5",
      name: "钱经理",
      department: "财务部",
      position: "财务经理",
      avatar: "",
      efficiency: 88,
      approvalRate: 95,
      expertise: ["财务报告", "预算报告"],
      recentLoad: 7,
      availability: "available",
    },
    {
      id: "user6",
      name: "孙总监",
      department: "人事部",
      position: "人事总监",
      avatar: "",
      efficiency: 87,
      approvalRate: 85,
      expertise: ["人事文档", "培训计划"],
      recentLoad: 6,
      availability: "available",
    },
  ]

  // 模拟审批流程数据
  const approvalFlows: ApprovalFlow[] = [
    {
      id: "flow1",
      name: "标准财务审批流程",
      description: "适用于财务报告、预算等财务类文档",
      steps: [
        {
          id: "step1",
          name: "部门经理审批",
          type: "approver",
          approvers: ["user1"],
        },
        {
          id: "step2",
          name: "财务经理审批",
          type: "approver",
          approvers: ["user5"],
        },
        {
          id: "step3",
          name: "总经理审批",
          type: "approver",
          approvers: ["user3"],
        },
      ],
    },
    {
      id: "flow2",
      name: "产品发布审批流程",
      description: "适用于产品规划、发布计划等产品类文档",
      steps: [
        {
          id: "step1",
          name: "技术经理审批",
          type: "approver",
          approvers: ["user1"],
        },
        {
          id: "step2",
          name: "产品总监审批",
          type: "approver",
          approvers: ["user2"],
        },
        {
          id: "step3",
          name: "市场主管审批",
          type: "approver",
          approvers: ["user4"],
        },
      ],
    },
    {
      id: "flow3",
      name: "紧急审批流程",
      description: "适用于需要快速审批的紧急文档",
      steps: [
        {
          id: "step1",
          name: "部门经理审批",
          type: "approver",
          approvers: ["user1"],
        },
        {
          id: "step2",
          name: "总经理审批",
          type: "approver",
          approvers: ["user3"],
        },
      ],
    },
  ]

  // 计算推荐分数
  const calculateRecommendationScore = (approver: Approver): number => {
    let score = 0
    const {
      considerExpertise,
      considerEfficiency,
      considerWorkload,
      expertiseWeight,
      efficiencyWeight,
      workloadWeight,
    } = settings

    // 专业匹配度
    if (considerExpertise) {
      const expertiseMatch = approver.expertise.includes(getDocumentTypeName(documentType)) ? 100 : 0
      score += (expertiseMatch * expertiseWeight) / 100
    }

    // 效率分数
    if (considerEfficiency) {
      const efficiencyScore = approver.efficiency
      score += (efficiencyScore * efficiencyWeight) / 100
    }

    // 工作负载分数（负载越低分数越高）
    if (considerWorkload) {
      const workloadScore = 100 - approver.recentLoad * 10 // 简单转换，负载越低分数越高
      score += (workloadScore * workloadWeight) / 100
    }

    // 紧急程度调整
    if (urgency === "urgent") {
      // 紧急情况下，效率更重要
      score = score * (approver.efficiency / 100) * 1.2
    } else if (urgency === "low") {
      // 低紧急度情况下，工作负载更重要
      score = score * ((100 - approver.recentLoad * 10) / 100) * 1.2
    }

    // 可用性调整
    if (approver.availability === "busy") {
      score *= 0.8
    } else if (approver.availability === "unavailable") {
      score *= 0.5
    }

    return Math.round(score)
  }

  // 获取推荐的审批人
  const getRecommendedApprovers = () => {
    return [...approvers]
      .map((approver) => ({
        ...approver,
        score: calculateRecommendationScore(approver),
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
  }

  // 获取推荐的审批流程
  const getRecommendedFlows = () => {
    if (documentType === "finance") {
      return approvalFlows.filter((flow) => flow.id === "flow1")
    } else if (documentType === "product") {
      return approvalFlows.filter((flow) => flow.id === "flow2")
    } else if (urgency === "urgent") {
      return approvalFlows.filter((flow) => flow.id === "flow3")
    }
    return approvalFlows
  }

  // 获取文档类型名称
  const getDocumentTypeName = (type: string): string => {
    switch (type) {
      case "finance":
        return "财务报告"
      case "product":
        return "产品文档"
      case "marketing":
        return "营销文档"
      case "hr":
        return "人事文档"
      case "contract":
        return "合同文档"
      default:
        return "通用文档"
    }
  }

  // 获取紧急程度名称
  const getUrgencyName = (urgency: string): string => {
    switch (urgency) {
      case "low":
        return "低"
      case "normal":
        return "普通"
      case "high":
        return "高"
      case "urgent":
        return "紧急"
      default:
        return "普通"
    }
  }

  // 获取可用性标签
  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            空闲
          </Badge>
        )
      case "busy":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            较忙
          </Badge>
        )
      case "unavailable":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            不可用
          </Badge>
        )
      default:
        return <Badge variant="outline">{availability}</Badge>
    }
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

  // 应用审批流程
  const applyFlow = (flowId: string) => {
    const flow = approvalFlows.find((f) => f.id === flowId)
    if (flow) {
      const approverIds: string[] = []
      flow.steps.forEach((step) => {
        if (step.type === "approver" && step.approvers) {
          step.approvers.forEach((approverId) => {
            if (!approverIds.includes(approverId)) {
              approverIds.push(approverId)
            }
          })
        }
      })
      setSelectedApprovers(approverIds)
      setSelectedFlow(flowId)
      toast({
        title: "已应用审批流程",
        description: `已应用"${flow.name}"审批流程`,
      })
    }
  }

  // 保存设置
  const saveSettings = () => {
    toast({
      title: "设置已保存",
      description: "推荐算法设置已成功保存",
    })
  }

  // 确认选择
  const confirmSelection = () => {
    if (selectedApprovers.length === 0) {
      toast({
        title: "请选择审批人",
        description: "请至少选择一个审批人",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "审批人已确认",
      description: `已选择 ${selectedApprovers.length} 位审批人`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">智能推荐</h1>
          <p className="text-muted-foreground">基于历史数据智能推荐审批人和审批流程</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium mb-2 block">文档类型</label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue placeholder="选择文档类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="finance">财务报告</SelectItem>
              <SelectItem value="product">产品文档</SelectItem>
              <SelectItem value="marketing">营销文档</SelectItem>
              <SelectItem value="hr">人事文档</SelectItem>
              <SelectItem value="contract">合同文档</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">紧急程度</label>
          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger>
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
          <label className="text-sm font-medium mb-2 block">部门</label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              <SelectItem value="tech">技术部</SelectItem>
              <SelectItem value="product">产品部</SelectItem>
              <SelectItem value="marketing">市场部</SelectItem>
              <SelectItem value="finance">财务部</SelectItem>
              <SelectItem value="hr">人事部</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="approvers" className="flex items-center gap-1">
            <UserCheck size={16} />
            推荐审批人
          </TabsTrigger>
          <TabsTrigger value="flows" className="flex items-center gap-1">
            <Users size={16} />
            推荐流程
          </TabsTrigger>
          <TabsTrigger value="selected" className="flex items-center gap-1">
            <Star size={16} />
            已选择
            {selectedApprovers.length > 0 && <Badge className="ml-1">{selectedApprovers.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings size={16} />
            算法设置
          </TabsTrigger>
        </TabsList>

        {/* 推荐审批人标签页 */}
        <TabsContent value="approvers">
          <Card>
            <CardHeader>
              <CardTitle>推荐审批人</CardTitle>
              <CardDescription>
                基于文档类型"{getDocumentTypeName(documentType)}"和紧急程度"{getUrgencyName(urgency)}"的推荐
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRecommendedApprovers().map((approver) => (
                  <div
                    key={approver.id}
                    className={`flex items-center justify-between p-4 border rounded-md ${
                      selectedApprovers.includes(approver.id) ? "bg-primary/5 border-primary/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{approver.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{approver.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{approver.department}</span>
                          <span className="mx-1">·</span>
                          <span>{approver.position}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Sparkles size={16} className="mr-1 text-yellow-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>推荐分数</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span className="font-medium">{approver.score}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getAvailabilityBadge(approver.availability)}
                        </div>
                      </div>
                      {selectedApprovers.includes(approver.id) ? (
                        <Button variant="outline" size="sm" onClick={() => removeApprover(approver.id)}>
                          移除
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => addApprover(approver.id)}>
                          添加
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">已选择 {selectedApprovers.length} 位审批人</div>
              <Button onClick={confirmSelection}>确认选择</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 推荐流程标签页 */}
        <TabsContent value="flows">
          <Card>
            <CardHeader>
              <CardTitle>推荐审批流程</CardTitle>
              <CardDescription>
                基于文档类型"{getDocumentTypeName(documentType)}"和紧急程度"{getUrgencyName(urgency)}"的推荐流程
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRecommendedFlows().map((flow) => (
                  <div
                    key={flow.id}
                    className={`p-4 border rounded-md ${
                      selectedFlow === flow.id ? "bg-primary/5 border-primary/30" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{flow.name}</h3>
                        <p className="text-sm text-muted-foreground">{flow.description}</p>
                      </div>
                      <Button
                        variant={selectedFlow === flow.id ? "outline" : "default"}
                        size="sm"
                        onClick={() => applyFlow(flow.id)}
                      >
                        {selectedFlow === flow.id ? "已应用" : "应用"}
                      </Button>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">审批步骤</h4>
                      <div className="space-y-2">
                        {flow.steps.map((step, index) => (
                          <div key={step.id} className="relative pl-6">
                            {index !== flow.steps.length - 1 && (
                              <div className="absolute left-2.5 top-3 w-px h-full bg-muted-foreground/20"></div>
                            )}
                            <div className="absolute left-0 top-2 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{step.name}</span>
                              {step.type === "approver" && step.approvers && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {step.approvers.map((approverId) => {
                                    const approver = approvers.find((a) => a.id === approverId)
                                    return approver ? (
                                      <Badge key={approverId} variant="secondary">
                                        {approver.name}
                                      </Badge>
                                    ) : null
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 已选择标签页 */}
        <TabsContent value="selected">
          <Card>
            <CardHeader>
              <CardTitle>已选择的审批人</CardTitle>
              <CardDescription>您已选择 {selectedApprovers.length} 位审批人</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedApprovers.length > 0 ? (
                <div className="space-y-4">
                  {selectedApprovers.map((approverId, index) => {
                    const approver = approvers.find((a) => a.id === approverId)
                    if (!approver) return null
                    return (
                      <div key={approver.id} className="relative pl-6">
                        {index !== selectedApprovers.length - 1 && (
                          <div className="absolute left-2.5 top-3 w-px h-full bg-muted-foreground/20"></div>
                        )}
                        <div className="absolute left-0 top-2 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <div className="text-xs">{index + 1}</div>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{approver.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{approver.name}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span>{approver.department}</span>
                                <span className="mx-1">·</span>
                                <span>{approver.position}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => removeApprover(approver.id)}>
                            移除
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">未选择审批人</h3>
                  <p className="text-muted-foreground">请在推荐审批人或推荐流程中选择审批人</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedApprovers([])}>
                清空选择
              </Button>
              <Button onClick={confirmSelection}>确认选择</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 算法设置标签页 */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>推荐算法设置</CardTitle>
              <CardDescription>配置智能推荐算法的参数和权重</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">考虑因素</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="consider-expertise">专业匹配度</Label>
                      <p className="text-sm text-muted-foreground">考虑审批人的专业领域与文档类型的匹配程度</p>
                    </div>
                    <Switch
                      id="consider-expertise"
                      checked={settings.considerExpertise}
                      onCheckedChange={(checked) => setSettings({ ...settings, considerExpertise: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="consider-efficiency">审批效率</Label>
                      <p className="text-sm text-muted-foreground">考虑审批人的历史审批效率</p>
                    </div>
                    <Switch
                      id="consider-efficiency"
                      checked={settings.considerEfficiency}
                      onCheckedChange={(checked) => setSettings({ ...settings, considerEfficiency: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="consider-workload">工作负载</Label>
                      <p className="text-sm text-muted-foreground">考虑审批人当前的工作负载</p>
                    </div>
                    <Switch
                      id="consider-workload"
                      checked={settings.considerWorkload}
                      onCheckedChange={(checked) => setSettings({ ...settings, considerWorkload: checked })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">权重设置</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="expertise-weight">专业匹配度权重</Label>
                      <span>{settings.expertiseWeight}%</span>
                    </div>
                    <Slider
                      id="expertise-weight"
                      min={0}
                      max={100}
                      step={5}
                      value={[settings.expertiseWeight]}
                      onValueChange={(value) => {
                        const expertiseWeight = value[0]
                        const remainingWeight = 100 - expertiseWeight
                        const efficiencyWeight = Math.round(
                          (settings.efficiencyWeight / (settings.efficiencyWeight + settings.workloadWeight)) *
                            remainingWeight,
                        )
                        const workloadWeight = remainingWeight - efficiencyWeight
                        setSettings({
                          ...settings,
                          expertiseWeight,
                          efficiencyWeight,
                          workloadWeight,
                        })
                      }}
                      disabled={!settings.considerExpertise}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="efficiency-weight">审批效率权重</Label>
                      <span>{settings.efficiencyWeight}%</span>
                    </div>
                    <Slider
                      id="efficiency-weight"
                      min={0}
                      max={100}
                      step={5}
                      value={[settings.efficiencyWeight]}
                      onValueChange={(value) => {
                        const efficiencyWeight = value[0]
                        const remainingWeight = 100 - settings.expertiseWeight
                        const workloadWeight = remainingWeight - efficiencyWeight
                        setSettings({
                          ...settings,
                          efficiencyWeight,
                          workloadWeight: workloadWeight >= 0 ? workloadWeight : 0,
                        })
                      }}
                      disabled={!settings.considerEfficiency}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="workload-weight">工作负载权重</Label>
                      <span>{settings.workloadWeight}%</span>
                    </div>
                    <Slider
                      id="workload-weight"
                      min={0}
                      max={100}
                      step={5}
                      value={[settings.workloadWeight]}
                      onValueChange={(value) => {
                        const workloadWeight = value[0]
                        const remainingWeight = 100 - settings.expertiseWeight
                        const efficiencyWeight = remainingWeight - workloadWeight
                        setSettings({
                          ...settings,
                          workloadWeight,
                          efficiencyWeight: efficiencyWeight >= 0 ? efficiencyWeight : 0,
                        })
                      }}
                      disabled={!settings.considerWorkload}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings}>保存设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
