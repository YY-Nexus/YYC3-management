"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Award, Star, Trophy, Medal, ThumbsUp } from "lucide-react"

type Honor = {
  id: number
  title: string
  description: string
  image: string
  type: "image" | "video"
  category: string
  date: string
  icon: "award" | "star" | "trophy" | "medal" | "thumbsUp"
}

const honors: Honor[] = [
  {
    id: 1,
    title: "年度最佳团队",
    description: "技术部在项目交付中表现卓越，连续三个季度超额完成目标",
    image: "/china-team-award.png",
    type: "image",
    category: "团队荣誉",
    date: "2023年12月",
    icon: "trophy",
  },
  {
    id: 2,
    title: "创新奖",
    description: "市场部推出的新营销策略取得显著成效，带来30%的业绩增长",
    image: "/china-innovation-award.png",
    type: "image",
    category: "公司奖项",
    date: "2023年10月",
    icon: "star",
  },
  {
    id: 3,
    title: "客户满意度冠军",
    description: "客服团队连续三个季度获得最高评分，客户满意度达到98%",
    image: "/china-customer-service-award.png",
    type: "image",
    category: "团队荣誉",
    date: "2023年09月",
    icon: "thumbsUp",
  },
  {
    id: 4,
    title: "节能环保奖",
    description: "公司在减少碳排放方面的突出贡献，年度能耗降低15%",
    image: "/china-environmental-award.png",
    type: "image",
    category: "公司奖项",
    date: "2023年07月",
    icon: "medal",
  },
  {
    id: 5,
    title: "最佳员工",
    description: "张明因出色的工作表现和团队协作精神获得季度最佳员工",
    image: "/china-employee-award.png",
    type: "image",
    category: "个人荣誉",
    date: "2023年06月",
    icon: "award",
  },
]

export function HonorsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [direction, setDirection] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  // 自动轮播
  useEffect(() => {
    if (!autoplay || isHovering) return

    const interval = setInterval(() => {
      setDirection(1)
      setActiveIndex((current) => (current + 1) % honors.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, isHovering])

  const nextSlide = () => {
    setDirection(1)
    setActiveIndex((current) => (current + 1) % honors.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setActiveIndex((current) => (current - 1 + honors.length) % honors.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  // 渲染图标
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
      default:
        return <Award className="h-6 w-6 text-yellow-500" />
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <div
      className="w-full max-w-6xl mx-auto mt-8 relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">优秀及荣誉展示</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={prevSlide}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={nextSlide}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl h-[400px] bg-gradient-to-r from-blue-50 to-indigo-50">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="relative overflow-hidden">
                <Image
                  src={honors[activeIndex].image || "/placeholder.svg"}
                  alt={honors[activeIndex].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </div>
              <div className="flex flex-col justify-center p-8 bg-white">
                <div className="flex items-center mb-4">
                  <div className="mr-3 p-2 rounded-full bg-yellow-100">{renderIcon(honors[activeIndex].icon)}</div>
                  <Badge variant="outline" className="bg-blue-50">
                    {honors[activeIndex].category}
                  </Badge>
                  <span className="ml-auto text-sm text-gray-500">{honors[activeIndex].date}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{honors[activeIndex].title}</h3>
                <p className="text-gray-600 mb-6">{honors[activeIndex].description}</p>
                <div className="mt-auto">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    查看详情
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {honors.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
