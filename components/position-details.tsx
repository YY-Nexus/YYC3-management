"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// 岗位详情数据
const positionData = [
  {
    title: "总经理",
    department: "行政管理部门",
    responsibilities: [
      "全面负责会所的运营管理，制定发展战略和年度计划",
      "协调各部门工作，确保会所整体目标的实现",
      "负责重要客户关系的维护和拓展",
      "监督各部门的工作质量和效率",
      "制定和完善会所的管理制度和流程",
    ],
    requirements: [
      "5年以上高端服务行业管理经验",
      "优秀的领导能力和决策能力",
      "良好的沟通协调能力和人际关系",
      "对高端服务行业有深入了解",
      "具备战略思维和创新意识",
    ],
    salary: "年薪制，包含基本工资、绩效奖金和其他福利",
  },
  {
    title: "行政主管",
    department: "行政管理部门",
    responsibilities: [
      "协助总经理处理日常事务，负责行政管理工作",
      "组织和协调各类会议，撰写工作报告和总结",
      "负责会所的档案管理和文件处理",
      "协调各部门之间的工作关系",
      "监督行政人员的工作表现",
    ],
    requirements: [
      "3年以上行政管理经验",
      "良好的文字表达能力和沟通能力",
      "熟悉办公软件和行政管理流程",
      "有较强的组织协调能力",
      "工作细致认真，有责任心",
    ],
    salary: "月薪制，包含基本工资和岗位津贴",
  },
  {
    title: "销售总监",
    department: "销售与市场部门",
    responsibilities: [
      "负责销售团队的管理和指导，制定销售目标和策略",
      "分析市场动态，调整销售计划以适应市场需求",
      "开发和维护重要客户资源",
      "制定销售激励政策，提高团队积极性",
      "定期进行销售数据分析和报告",
    ],
    requirements: [
      "5年以上销售管理经验，高端服务行业优先",
      "优秀的团队管理能力和领导能力",
      "良好的沟通能力和谈判技巧",
      "具备数据分析能力和市场洞察力",
      "有较强的目标达成能力",
    ],
    salary: "底薪加提成模式",
  },
  {
    title: "销售专员",
    department: "销售与市场部门",
    responsibilities: [
      "执行市场推广活动的具体任务，收集市场反馈信息",
      "协助销售团队完成客户开发和维护工作",
      "接待潜在客户，介绍会所服务和设施",
      "跟进客户需求，促成销售成交",
      "维护客户关系，提供售后服务",
    ],
    requirements: [
      "2年以上销售经验，服务行业优先",
      "良好的沟通能力和人际交往能力",
      "有较强的学习能力和团队合作精神",
      "形象气质佳，普通话标准",
      "有一定的抗压能力和解决问题的能力",
    ],
    salary: "固定月薪制",
  },
  {
    title: "服务经理",
    department: "运营服务部门",
    responsibilities: [
      "全面负责现场服务的管理工作，协调各部门配合",
      "制定服务标准和流程，监督员工执行情况",
      "负责服务团队的培训和管理",
      "处理客户投诉和建议，提升客户满意度",
      "定期评估服务质量，提出改进方案",
    ],
    requirements: [
      "3年以上高端服务行业管理经验",
      "优秀的团队管理能力和沟通能力",
      "熟悉服务流程和标准",
      "有较强的问题解决能力和应变能力",
      "具备良好的职业素养和服务意识",
    ],
    salary: "月薪制，包含基本工资和绩效奖金",
  },
  {
    title: "服务员",
    department: "运营服务部门",
    responsibilities: [
      "负责接待顾客，提供高质量的服务体验",
      "完成上级安排的各项任务，保持良好的职业形象",
      "维护服务区域的整洁和秩序",
      "了解客户需求，提供个性化服务",
      "协助处理客户投诉和建议",
    ],
    requirements: [
      "1年以上服务行业经验",
      "形象气质佳，普通话标准",
      "有较强的服务意识和团队合作精神",
      "工作认真负责，有耐心",
      "能适应轮班工作",
    ],
    salary: "小时工资制，包含基本工资和小费收入",
  },
  {
    title: "技术工程师",
    department: "技术支持部门",
    responsibilities: [
      "负责设备的技术支持和维护工作，解决技术难题",
      "参与设备采购和技术升级的决策过程",
      "负责会所音响、灯光设备的日常维护和检修",
      "定期更新设备，提升技术性能和用户体验",
      "培训员工正确使用设备，减少故障发生",
    ],
    requirements: [
      "3年以上相关技术工作经验",
      "熟悉音响、灯光等设备的原理和维护",
      "具备较强的故障排除能力",
      "有一定的项目管理经验",
      "工作认真细致，有责任心",
    ],
    salary: "月薪制，包含基本工资和技术津贴",
  },
  {
    title: "设备管理员",
    department: "技术支持部门",
    responsibilities: [
      "负责设备的日常管理和登记，确保设备账目清晰",
      "定期检查设备状态，及时上报问题并协助维修",
      "管理设备库存，提出设备采购建议",
      "协助技术工程师进行设备维护",
      "记录设备使用情况，编制设备使用报告",
    ],
    requirements: [
      "2年以上设备管理经验",
      "熟悉基本设备操作和维护知识",
      "有较强的责任心和细致的工作态度",
      "具备基本的故障识别能力",
      "有良好的沟通能力和团队合作精神",
    ],
    salary: "固定月薪制",
  },
  {
    title: "财务主管",
    department: "财务与人力资源部门",
    responsibilities: [
      "全面负责财务管理工作，制定财务政策和制度",
      "监督财务人员的工作，确保财务数据准确无误",
      "负责会所的财务核算和预算管理",
      "定期编制财务报表，为管理层提供决策依据",
      "管理会所的资金运作，确保资金安全",
    ],
    requirements: [
      "5年以上财务管理经验",
      "持有会计师资格证书",
      "熟悉财务法规和税务政策",
      "有较强的财务分析能力和风险控制意识",
      "工作严谨，有良好的职业道德",
    ],
    salary: "月薪制，包含基本工资和岗位津贴",
  },
  {
    title: "HR专员",
    department: "财务与人力资源部门",
    responsibilities: [
      "负责人力资源管理的具体工作，包括招聘、培训、薪酬管理等",
      "组织员工活动，增强团队凝聚力和归属感",
      "负责员工档案管理和劳动合同签订",
      "协助制定和执行人力资源政策",
      "处理员工关系和日常人事事务",
    ],
    requirements: [
      "2年以上人力资源工作经验",
      "熟悉劳动法规和人力资源管理流程",
      "有较强的沟通能力和协调能力",
      "具备基本的心理学知识",
      "工作细致，有良好的保密意识",
    ],
    salary: "固定月薪制",
  },
]

export function PositionDetails() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // 过滤岗位
  const filteredPositions = positionData.filter((position) => {
    const matchesSearch =
      position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.department.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return (
      matchesSearch &&
      position.department.includes(
        activeTab === "admin"
          ? "行政"
          : activeTab === "sales"
            ? "销售"
            : activeTab === "service"
              ? "服务"
              : activeTab === "tech"
                ? "技术"
                : "财务",
      )
    )
  })

  return (
    <div className="p-6 animate-fade-in">
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        岗位详情与职责要求
      </motion.h1>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="搜索岗位或部门..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">全部岗位</TabsTrigger>
          <TabsTrigger value="admin">行政管理</TabsTrigger>
          <TabsTrigger value="sales">销售市场</TabsTrigger>
          <TabsTrigger value="service">运营服务</TabsTrigger>
          <TabsTrigger value="tech">技术支持</TabsTrigger>
          <TabsTrigger value="finance">财务人力</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 gap-6">
            {filteredPositions.length > 0 ? (
              filteredPositions.map((position, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{position.title}</span>
                        <span className="text-sm font-normal px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {position.department}
                        </span>
                      </CardTitle>
                      <CardDescription>{position.salary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-2">岗位职责</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {position.responsibilities.map((item, idx) => (
                              <li key={idx} className="text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">任职要求</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {position.requirements.map((item, idx) => (
                              <li key={idx} className="text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">未找到匹配的岗位，请尝试其他搜索条件</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
