"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Briefcase, DollarSign, GraduationCap, Coffee } from "lucide-react"
import { OrganizationChart } from "@/components/organization-chart"

// 组织架构数据
const orgData = {
  name: "总经理",
  children: [
    {
      name: "行政管理部门",
      children: [{ name: "行政主管" }, { name: "制度制定与执行" }, { name: "日常运营监督" }],
    },
    {
      name: "销售与市场部门",
      children: [{ name: "销售总监" }, { name: "销售专员" }, { name: "商务客户拓展" }, { name: "市场推广活动" }],
    },
    {
      name: "运营服务部门",
      children: [{ name: "服务经理" }, { name: "服务员团队" }, { name: "现场服务管理" }, { name: "客户满意度提升" }],
    },
    {
      name: "技术支持部门",
      children: [
        { name: "技术工程师" },
        { name: "设备管理员" },
        { name: "音响、灯光设备维护" },
        { name: "IT系统保障" },
      ],
    },
    {
      name: "财务与人力资源部门",
      children: [{ name: "财务主管" }, { name: "HR专员" }, { name: "财务管理" }, { name: "人员招聘与培训" }],
    },
  ],
}

// 薪资结构数据
const salaryData = [
  {
    position: "总经理",
    range: "年薪制，包含基本工资、绩效奖金和其他福利",
    description: "根据会所规模和行业标准设定，负责全面管理",
  },
  {
    position: "行政主管",
    range: "月薪制，包含基本工资和岗位津贴",
    description: "根据职责和经验设定，负责行政管理工作",
  },
  {
    position: "销售总监",
    range: "底薪加提成模式",
    description: "根据销售业绩和团队管理能力设定",
  },
  {
    position: "销售专员",
    range: "固定月薪制",
    description: "根据工作任务和绩效设定",
  },
  {
    position: "服务经理",
    range: "月薪制，包含基本工资和绩效奖金",
    description: "根据服务质量和服务年限设定",
  },
  {
    position: "服务员",
    range: "小时工资制，包含基本工资和小费收入",
    description: "根据工作时间和服务质量设定",
  },
  {
    position: "技术工程师",
    range: "月薪制，包含基本工资和技术津贴",
    description: "根据技术水平和工作经验设定",
  },
  {
    position: "设备管理员",
    range: "固定月薪制",
    description: "根据工作内容和责任设定",
  },
  {
    position: "财务主管",
    range: "月薪制，包含基本工资和岗位津贴",
    description: "根据财务管理能力和专业水平设定",
  },
  {
    position: "HR专员",
    range: "固定月薪制",
    description: "根据人力资源管理经验和工作量设定",
  },
]

// 福利政策数据
const benefitsData = [
  {
    title: "社保与公积金",
    description: "为全体员工缴纳社会保险和住房公积金，保障员工的基本权益",
  },
  {
    title: "年假与节假日福利",
    description: "提供法定年假和带薪假期，节日发放礼品或奖金，提升员工满意度",
  },
  {
    title: "培训与发展计划",
    description: "定期组织职业技能提升课程，涵盖服务礼仪、销售技巧、技术知识等方面，促进员工个人成长和职业发展",
  },
  {
    title: "新员工入职培训",
    description: "制定完善的入职培训计划，帮助新员工快速熟悉工作环境和岗位要求",
  },
  {
    title: "职业技能提升课程",
    description: "定期组织职业技能提升课程，涵盖服务礼仪、销售技巧、技术知识等方面，促进员工个人成长和职业发展",
  },
]

// 主题包间数据
const themeRoomsData = [
  {
    season: "春季主题包间",
    style: "以清新、生机盎然为主题，采用绿色为主色调，搭配花卉图案的壁纸和家具",
    decoration: "室内陈设模拟春天的自然景观，例如樱花树、草地等元素，营造出置身于春日花园的感觉",
    culture: "结合春季的节气特点，如立春、雨水、惊蛰等，设计特定的文化展示墙，介绍节气相关的习俗和故事",
    service: "提供与春季相关的特色饮品和服务，如绿茶、花茶等",
  },
  {
    season: "夏季主题包间",
    style: "以明亮、热情为主题，采用蓝色和橙色为主色调，搭配沙滩、海洋元素的装饰品",
    decoration: "利用灯光效果模拟夏日阳光，增加室内的活力感",
    culture: "融入夏季节气的特点，如小暑、大暑等，通过装饰和活动展现夏季的传统习俗，如吃西瓜、饮凉茶等",
    service: "提供与夏季相关的服务项目，如冰镇饮品、冷餐等",
  },
  {
    season: "秋季主题包间",
    style: "以丰收、温暖为主题，采用金黄色和红色为主色调，搭配枫叶、果实等元素的装饰",
    decoration: "模拟秋日的田园风光，使用木质家具和暖色调灯光，营造温馨氛围",
    culture: "结合秋季节气的特点，如白露、秋分等，通过装饰和活动展现秋季的传统习俗，如赏月、品尝桂花糕等",
    service: "提供与秋季相关的特色服务，如热红酒、南瓜派等",
  },
  {
    season: "冬季主题包间",
    style: "以寒冷、宁静为主题，采用白色和银色为主色调，搭配雪花、圣诞树等元素的装饰",
    decoration: "利用灯光效果模拟冬日雪景，增加室内的浪漫感",
    culture: "融入冬季节气的特点，如冬至、小寒等，通过装饰和活动展现冬季的传统习俗，如喝姜茶、吃饺子等",
    service: "提供与冬季相关的服务项目，如热巧克力、烤火腿等",
  },
]

// 节气包间数据
const solarTermRoomsData = {
  naming:
    '包间名称采用节气的谐音或寓意，如"立春"包间可命名为"春意盎然"，"冬至"包间可命名为"团圆之夜"。名称设计注重文化内涵和艺术美感，使顾客在进入包间时就能感受到浓厚的文化氛围。',
  design:
    "每个节气包间根据其对应的节气特点进行装饰设计，如立春包间可以采用绿色植物和花卉装饰，冬至包间可以采用雪花和暖炉装饰。包间内部布置结合节气的传统习俗和文化背景，通过壁画、摆件等形式展现节气的独特魅力。",
  service:
    "根据节气特点提供相应的特色服务，如在立春包间提供春卷制作体验，在冬至包间提供饺子品尝活动。结合节气的饮食文化，推出节气专属菜单，让顾客在享受娱乐的同时感受传统文化的魅力。",
}

export function BusinessClubOrganization() {
  const [activeTab, setActiveTab] = useState("structure")

  return (
    <div className="p-6 animate-fade-in">
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        商务会所组织架构与岗位分布
      </motion.h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 grid grid-cols-5 md:w-[600px]">
          <TabsTrigger value="structure" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            <span>组织架构</span>
          </TabsTrigger>
          <TabsTrigger value="salary" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>薪资体系</span>
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            <span>福利培训</span>
          </TabsTrigger>
          <TabsTrigger value="season" className="flex items-center gap-1">
            <Coffee className="h-4 w-4" />
            <span>四季主题</span>
          </TabsTrigger>
          <TabsTrigger value="solar" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>节气主题</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle>组织架构图</CardTitle>
              <CardDescription>商务会所的组织架构与岗位分布</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] overflow-auto">
                <OrganizationChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary">
          <Card>
            <CardHeader>
              <CardTitle>薪资福利体系</CardTitle>
              <CardDescription>各岗位薪资范围与结构</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {salaryData.map((item, index) => (
                  <motion.div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <h3 className="text-lg font-semibold">{item.position}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.range}</p>
                    <p className="text-sm mt-2">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>员工福利与培训发展</CardTitle>
              <CardDescription>员工福利政策与职业发展路径</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefitsData.map((item, index) => (
                  <motion.div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm mt-2">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="season">
          <Card>
            <CardHeader>
              <CardTitle>四季主题包间</CardTitle>
              <CardDescription>四季主题包间的设计与文化特色</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {themeRoomsData.map((item, index) => (
                  <motion.div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <h3 className="text-lg font-semibold">{item.season}</h3>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">设计风格：</span>
                        {item.style}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">装饰特点：</span>
                        {item.decoration}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">文化融入：</span>
                        {item.culture}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">特色服务：</span>
                        {item.service}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solar">
          <Card>
            <CardHeader>
              <CardTitle>节气主题包间</CardTitle>
              <CardDescription>24节气主题包间的设计与文化特色</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <motion.div
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold">包间命名规则</h3>
                  <p className="text-sm mt-2">{solarTermRoomsData.naming}</p>
                </motion.div>

                <motion.div
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold">装饰设计与节气关联</h3>
                  <p className="text-sm mt-2">{solarTermRoomsData.design}</p>
                </motion.div>

                <motion.div
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold">特色服务项目</h3>
                  <p className="text-sm mt-2">{solarTermRoomsData.service}</p>
                </motion.div>

                <motion.div
                  className="border rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-4 text-center">节气包间一览（24间）</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {[
                      "立春",
                      "雨水",
                      "惊蛰",
                      "春分",
                      "清明",
                      "谷雨",
                      "立夏",
                      "小满",
                      "芒种",
                      "夏至",
                      "小暑",
                      "大暑",
                      "立秋",
                      "处暑",
                      "白露",
                      "秋分",
                      "寒露",
                      "霜降",
                      "立冬",
                      "小雪",
                      "大雪",
                      "冬至",
                      "小寒",
                      "大寒",
                    ].map((term, index) => (
                      <div
                        key={index}
                        className="text-center p-2 border rounded bg-white hover:bg-gray-100 transition-colors"
                      >
                        {term}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
