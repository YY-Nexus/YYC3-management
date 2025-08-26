"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MainNavigation } from "@/components/main-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  Star,
  Trophy,
  Medal,
  ThumbsUp,
  Calendar,
  User,
  Building,
  Lightbulb,
  Heart,
  Zap,
  Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 扩展荣誉数据类型
type Honor = {
  id: number
  title: string
  description: string
  image: string
  category: "company" | "team" | "personal"
  type: "achievement" | "innovation" | "service" | "sustainability" | "leadership" | "partnership"
  date: string
  recipient: string
  icon: "award" | "star" | "trophy" | "medal" | "thumbsUp" | "lightbulb" | "heart" | "zap"
  level: "国家级" | "省级" | "市级" | "行业级" | "公司级"
}

// 扩展荣誉数据
const honorsData: Honor[] = [
  {
    id: 1,
    title: "年度最佳团队",
    description: "技术部在项目交付中表现卓越，连续三个季度超额完成目标，为公司创造了显著的价值。",
    image: "/china-team-award.png",
    category: "team",
    type: "achievement",
    date: "2023年12月",
    recipient: "技术部",
    icon: "trophy",
    level: "公司级",
  },
  {
    id: 2,
    title: "创新奖",
    description: "市场部推出的新营销策略取得显著成效，带来30%的业绩增长，开创了行业营销新模式。",
    image: "/china-innovation-award.png",
    category: "company",
    type: "innovation",
    date: "2023年10月",
    recipient: "言语云科技",
    icon: "lightbulb",
    level: "行业级",
  },
  {
    id: 3,
    title: "客户满意度冠军",
    description: "客服团队连续三个季度获得最高评分，客户满意度达到98%，树立了行业服务标杆。",
    image: "/china-customer-service-award.png",
    category: "team",
    type: "service",
    date: "2023年09月",
    recipient: "客服团队",
    icon: "heart",
    level: "公司级",
  },
  {
    id: 4,
    title: "节能环保奖",
    description: "公司在减少碳排放方面的突出贡献，年度能耗降低15%，获得政府环保部门表彰。",
    image: "/china-environmental-award.png",
    category: "company",
    type: "sustainability",
    date: "2023年07月",
    recipient: "言语云科技",
    icon: "medal",
    level: "市级",
  },
  {
    id: 5,
    title: "最佳员工",
    description: "张明因出色的工作表现和团队协作精神获得季度最佳员工，他的创新思维为团队带来了新的发展方向。",
    image: "/china-employee-award.png",
    category: "personal",
    type: "achievement",
    date: "2023年06月",
    recipient: "张明",
    icon: "award",
    level: "公司级",
  },
  {
    id: 6,
    title: "技术创新奖",
    description: "李华开发的新算法提高了系统效率30%，获得公司技术创新奖，并申请了相关专利。",
    image: "/china-tech-innovation.png",
    category: "personal",
    type: "innovation",
    date: "2023年05月",
    recipient: "李华",
    icon: "star",
    level: "公司级",
  },
  {
    id: 7,
    title: "最佳合作伙伴",
    description: "言语云科技被评为年度最佳合作伙伴，与多家企业建立了长期稳定的战略合作关系。",
    image: "/china-business-partner-award.png",
    category: "company",
    type: "partnership",
    date: "2023年04月",
    recipient: "言语云科技",
    icon: "trophy",
    level: "行业级",
  },
  {
    id: 8,
    title: "优秀管理者",
    description: "王总监在部门管理和团队建设方面表现突出，员工满意度和工作效率双双提升。",
    image: "/outstanding-chinese-manager-award.png",
    category: "personal",
    type: "leadership",
    date: "2023年03月",
    recipient: "王总监",
    icon: "medal",
    level: "公司级",
  },
  {
    id: 9,
    title: "科技进步奖",
    description: "言语云科技自主研发的人工智能系统获得省科技进步奖，标志着公司技术实力的重大突破。",
    image: "/china-science-progress-award.png",
    category: "company",
    type: "innovation",
    date: "2023年02月",
    recipient: "言语云科技",
    icon: "zap",
    level: "省级",
  },
  {
    id: 10,
    title: "优质服务标兵",
    description: "赵工程师凭借专业的技术支持和热情的服务态度，获得客户一致好评，被评为优质服务标兵。",
    image: "/china-service-excellence.png",
    category: "personal",
    type: "service",
    date: "2023年01月",
    recipient: "赵工程师",
    icon: "thumbsUp",
    level: "公司级",
  },
  {
    id: 11,
    title: "绿色企业认证",
    description: "言语云科技通过严格的环保审核，获得国家绿色企业认证，彰显了公司对可持续发展的承诺。",
    image: "/china-green-company.png",
    category: "company",
    type: "sustainability",
    date: "2022年12月",
    recipient: "言语云科技",
    icon: "award",
    level: "国家级",
  },
  {
    id: 12,
    title: "产品设计金奖",
    description: "设计团队开发的新一代用户界面获得行业产品设计金奖，被誉为用户体验的典范。",
    image: "/china-product-design-gold-award.png",
    category: "team",
    type: "innovation",
    date: "2022年11月",
    recipient: "设计团队",
    icon: "star",
    level: "行业级",
  },
]

// 渲染图标函数
const renderIcon = (iconName: Honor["icon"]) => {
  switch (iconName) {
    case "award":
      return <Award className="h-6 w-6 text-yellow-500" />
    case "star":
      return <Star className="h-6 w-6 text-yellow-500" />
    case "trophy":
      return <Trophy className="h-6 w-6 text-yellow-500" />
    case "medal":
      return <Medal className="h-6 w-6 text-yellow-500" />
    case "thumbsUp":
      return <ThumbsUp className="h-6 w-6 text-yellow-500" />
    case "lightbulb":
      return <Lightbulb className="h-6 w-6 text-yellow-500" />
    case "heart":
      return <Heart className="h-6 w-6 text-yellow-500" />
    case "zap":
      return <Zap className="h-6 w-6 text-yellow-500" />
    default:
      return <Award className="h-6 w-6 text-yellow-500" />
  }
}

// 获取荣誉类型的中文名称
const getTypeLabel = (type: Honor["type"]) => {
  const typeMap = {
    achievement: "成就奖项",
    innovation: "创新奖项",
    service: "服务奖项",
    sustainability: "可持续发展",
    leadership: "领导力奖项",
    partnership: "合作伙伴奖",
  }
  return typeMap[type]
}

export default function HonorsPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | "company" | "team" | "personal">("all")
  const [activeType, setActiveType] = useState<"all" | Honor["type"]>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<"all" | Honor["level"]>("all")

  // 根据当前选择的类别、类型和搜索词过滤荣誉数据
  const filteredHonors = honorsData.filter((honor) => {
    // 类别过滤
    const categoryMatch = activeCategory === "all" || honor.category === activeCategory

    // 类型过滤
    const typeMatch = activeType === "all" || honor.type === activeType

    // 级别过滤
    const levelMatch = levelFilter === "all" || honor.level === levelFilter

    // 搜索过滤
    const searchMatch =
      searchQuery === "" ||
      honor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      honor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      honor.recipient.toLowerCase().includes(searchQuery.toLowerCase())

    return categoryMatch && typeMatch && levelMatch && searchMatch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <MainNavigation />

      {/* 主要内容区域 */}
      <main className="main-content p-6 md:p-8">
        {/* 顶部栏 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">荣誉展示</h1>
          <p className="text-gray-600">展示我们的成就与荣誉，见证团队的成长与进步</p>
        </motion.div>

        {/* 搜索和筛选区域 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索荣誉..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="选择类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类别</SelectItem>
                <SelectItem value="company">公司荣誉</SelectItem>
                <SelectItem value="team">团队荣誉</SelectItem>
                <SelectItem value="personal">个人荣誉</SelectItem>
              </SelectContent>
            </Select>

            <Select value={activeType} onValueChange={(value) => setActiveType(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="选择奖项类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="achievement">成就奖项</SelectItem>
                <SelectItem value="innovation">创新奖项</SelectItem>
                <SelectItem value="service">服务奖项</SelectItem>
                <SelectItem value="sustainability">可持续发展</SelectItem>
                <SelectItem value="leadership">领导力奖项</SelectItem>
                <SelectItem value="partnership">合作伙伴奖</SelectItem>
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="选择级别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部级别</SelectItem>
                <SelectItem value="国家级">国家级</SelectItem>
                <SelectItem value="省级">省级</SelectItem>
                <SelectItem value="市级">市级</SelectItem>
                <SelectItem value="行业级">行业级</SelectItem>
                <SelectItem value="公司级">公司级</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 荣誉展示区域 */}
        <div className="mb-6">
          <Tabs
            value={activeType === "all" ? "all" : activeType}
            onValueChange={(value) => setActiveType(value as any)}
          >
            <TabsList className="bg-white shadow-sm mb-6 w-full overflow-x-auto flex-nowrap">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                全部类型
              </TabsTrigger>
              <TabsTrigger
                value="achievement"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                <Trophy className="w-4 h-4 mr-1" />
                成就奖项
              </TabsTrigger>
              <TabsTrigger
                value="innovation"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                创新奖项
              </TabsTrigger>
              <TabsTrigger
                value="service"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                <Heart className="w-4 h-4 mr-1" />
                服务奖项
              </TabsTrigger>
              <TabsTrigger
                value="sustainability"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                <Zap className="w-4 h-4 mr-1" />
                可持续发展
              </TabsTrigger>
              <TabsTrigger
                value="leadership"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                <User className="w-4 h-4 mr-1" />
                领导力奖项
              </TabsTrigger>
              <TabsTrigger
                value="partnership"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                <Building className="w-4 h-4 mr-1" />
                合作伙伴奖
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 结果统计 */}
        <div className="mb-4 text-sm text-gray-500">找到 {filteredHonors.length} 个荣誉项目</div>

        {/* 荣誉卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHonors.length > 0 ? (
            filteredHonors.map((honor, index) => (
              <motion.div
                key={honor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48">
                    <Image src={honor.image || "/placeholder.svg"} alt={honor.title} fill className="object-cover" />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-500 hover:bg-blue-600">{honor.level}</Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <Badge className="mb-2" variant="secondary">
                        {honor.category === "company"
                          ? "公司荣誉"
                          : honor.category === "team"
                            ? "团队荣誉"
                            : "个人荣誉"}
                      </Badge>
                      <h3 className="text-xl font-bold text-white">{honor.title}</h3>
                    </div>
                  </div>
                  <CardContent className="flex-grow flex flex-col p-4">
                    <div className="flex items-center mb-3 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{honor.date}</span>
                      <span className="mx-2">•</span>
                      <span>{honor.recipient}</span>
                    </div>
                    <p className="text-gray-600 mb-4 flex-grow">{honor.description}</p>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        {renderIcon(honor.icon)}
                        <span className="ml-2 text-sm text-gray-500">{getTypeLabel(honor.type)}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/honors/${honor.id}`}>查看详情</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">未找到匹配的荣誉</h3>
              <p className="text-gray-500">请尝试调整筛选条件或搜索关键词</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
