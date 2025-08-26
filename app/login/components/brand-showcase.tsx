"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function BrandShowcase() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900">
      {/* 背景图片 */}
      <Image
        src="/futuristic-cloud-computing.png?城市夜景"
        alt="YY-Meta Nexus³ OS"
        fill
        className="object-cover opacity-40"
        priority
      />

      {/* 品牌色调滤镜 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-indigo-900/60 z-10"></div>

      {/* 品牌内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="relative h-32 w-32 md:h-40 md:w-40">
              <Image src="/logo.png?中国风logo" alt="言语云³" fill className="object-contain" />
            </div>
          </div>

          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            言语丨云<sup>3</sup> 智能管理系统
          </motion.h1>

          <motion.h2
            className="text-xl md:text-2xl font-light mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            YY-Meta Nexus<sup>3</sup> OS
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            智能云端管理，赋能企业未来
          </motion.p>
        </motion.div>

        {/* 底部品牌价值主张 */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <div className="w-1 h-8 bg-blue-400 mr-3"></div>
              <p>数据驱动决策</p>
            </div>
            <div className="flex items-center">
              <div className="w-1 h-8 bg-indigo-400 mr-3"></div>
              <p>智能流程优化</p>
            </div>
            <div className="flex items-center">
              <div className="w-1 h-8 bg-purple-400 mr-3"></div>
              <p>安全可靠保障</p>
            </div>
          </div>

          <p className="mt-6 text-sm opacity-80">"言语云³彻底改变了我们的业务管理方式" — 某知名企业CEO</p>
        </motion.div>
      </div>
    </div>
  )
}
