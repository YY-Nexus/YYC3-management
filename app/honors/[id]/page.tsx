"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { MainNavigation } from "@/components/main-navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  Award,
  Star,
  Trophy,
  Medal,
  ThumbsUp,
  Calendar,
  User,
  Building,
  Users,
  Lightbulb,
  Heart,
  Zap,
  ArrowLeft,
  Share2,
  Download,
  Printer,
  MapPin,
  FileText,
  ImageIcon,
} from "lucide-react"

// 荣誉数据类型
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
  location?: string
  issuer?: string
  details?: string
  gallery?: string[]
  documents?: { name: string; url: string }[]
}

// 模拟荣誉数据
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
    location: "北京总部",
    issuer: "言语云科技管理委员会",
    details:
      "技术部在过去一年中完成了多个重要项目，包括核心系统升级、新产品研发和技术架构优化。团队成员展现出色的协作精神和专业能力，多次克服技术难题，确保项目按时高质量交付。特别是在第三季度的系统重构项目中，团队加班加点，成功将系统性能提升了40%，获得了客户的高度评价。",
    gallery: ["/china-team-award-1.png", "/chinese-team-award-ceremony-2.png", "/chinese-team-award-ceremony-3.png"],
    documents: [
      { name: "获奖证书", url: "#" },
      { name: "表彰决定", url: "#" },
    ],
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
    location: "上海创新中心",
    issuer: "中国软件行业协会",
    details:
      "言语云科技凭借创新的AI驱动营销解决方案获得此奖项。该解决方案整合了大数据分析和人工智能技术，能够精准预测客户需求并提供个性化的营销策略。这一创新不仅为公司带来了30%的业绩增长，还开创了行业营销的新模式，被多家媒体报道并获得行业专家的高度评价。",
    gallery: ["/china-innovation-award-ceremony-1.png", "/placeholder.svg?height=400&width=600&query=中国创新奖颁奖典礼2"],
    documents: [
      { name: "获奖证书", url: "#" },
      { name: "新闻报道", url: "#" },
      { name: "技术白皮书", url: "#" },
    ],
  },
  // 其他荣誉数据...
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

export default function HonorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [honor, setHonor] = useState<Honor | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [selectedImage, setSelectedImage] = useState("")

  useEffect(() => {
    // 在实际应用中，这里应该从API获取数据
    const id = Number(params.id)
    const foundHonor = honorsData.find((h) => h.id === id)

    if (foundHonor) {
      setHonor(foundHonor)
      if (foundHonor.gallery && foundHonor.gallery.length > 0) {
        setSelectedImage(foundHonor.gallery[0])
      }
    } else {
      // 如果找不到荣誉，重定向到荣誉列表页
      router.push("/honors")
    }
  }, [params.id, router])

  if (!honor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <MainNavigation />

      {/* 主要内容区域 */}
      <main className="main-content p-6 md:p-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/honors")} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回荣誉列表
          </Button>
        </div>

        {/* 荣誉详情头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-8"
        >
          <div className="relative h-64 md:h-80">
            <Image src={honor.image || "/placeholder.svg"} alt={honor.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-blue-500 hover:bg-blue-600">{honor.level}</Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                  {honor.category === "company" ? "公司荣誉" : honor.category === "team" ? "团队荣誉" : "个人荣誉"}
                </Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                  {getTypeLabel(honor.type)}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{honor.title}</h1>
              <p className="text-white/80 text-lg">{honor.description}</p>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">获奖日期</p>
                  <p className="font-medium">{honor.date}</p>
                </div>
              </div>
              <div className="flex items-center">
                {honor.category === "company" ? (
                  <Building className="h-5 w-5 text-gray-500 mr-3" />
                ) : honor.category === "team" ? (
                  <Users className="h-5 w-5 text-gray-500 mr-3" />
                ) : (
                  <User className="h-5 w-5 text-gray-500 mr-3" />
                )}
                <div>
                  <p className="text-sm text-gray-500">获奖者</p>
                  <p className="font-medium">{honor.recipient}</p>
                </div>
              </div>
              {honor.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">颁奖地点</p>
                    <p className="font-medium">{honor.location}</p>
                  </div>
                </div>
              )}
              {honor.issuer && (
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">颁发机构</p>
                    <p className="font-medium">{honor.issuer}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button variant="outline" className="flex items-center">
            <Share2 className="mr-2 h-4 w-4" />
            分享
          </Button>
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            下载证书
          </Button>
          <Button variant="outline" className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            打印
          </Button>
        </div>

        {/* 详情标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-white shadow-sm mb-6">
            <TabsTrigger value="details" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              详细信息
            </TabsTrigger>
            {honor.gallery && honor.gallery.length > 0 && (
              <TabsTrigger
                value="gallery"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                图片展示
              </TabsTrigger>
            )}
            {honor.documents && honor.documents.length > 0 && (
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                相关文档
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">荣誉详情</h2>
                <p className="text-gray-700 whitespace-pre-line">{honor.details}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">图片展示</h2>
                <div className="mb-6">
                  <div className="relative h-80 rounded-lg overflow-hidden">
                    <Image src={selectedImage || "/placeholder.svg"} alt="荣誉图片" fill className="object-contain" />
                  </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {honor.gallery?.map((image, index) => (
                    <div
                      key={index}
                      className={`relative h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                        selectedImage === image ? "border-blue-500" : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`荣誉图片 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">相关文档</h2>
                <div className="space-y-4">
                  {honor.documents?.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <span>{doc.name}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          下载
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 相关荣誉 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">相关荣誉</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {honorsData
              .filter((h) => h.id !== honor.id && (h.category === honor.category || h.type === honor.type))
              .slice(0, 3)
              .map((relatedHonor) => (
                <Card key={relatedHonor.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="relative h-40">
                    <Image
                      src={relatedHonor.image || "/placeholder.svg"}
                      alt={relatedHonor.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-lg font-bold text-white">{relatedHonor.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{relatedHonor.level}</Badge>
                      <span className="text-sm text-gray-500">{relatedHonor.date}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                      <a href={`/honors/${relatedHonor.id}`}>查看详情</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}
