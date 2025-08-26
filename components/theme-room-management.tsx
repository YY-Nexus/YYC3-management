"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Leaf, Sun, Cloud, Snowflake } from "lucide-react"

// 四季主题包间数据
const seasonRooms = [
  {
    id: "spring",
    name: "春季主题包间",
    icon: <Leaf className="h-5 w-5 text-green-500" />,
    color: "bg-green-50 border-green-200",
    textColor: "text-green-800",
    badgeColor: "bg-green-100 text-green-800",
    description: "以清新、生机盎然为主题，采用绿色为主色调，搭配花卉图案的壁纸和家具",
    features: [
      "室内陈设模拟春天的自然景观，例如樱花树、草地等元素",
      "结合春季的节气特点，如立春、雨水、惊蛰等，设计特定的文化展示墙",
      "提供与春季相关的特色饮品和服务，如绿茶、花茶等",
      "背景音乐以轻快、明亮的春季主题音乐为主",
    ],
    capacity: "可容纳8-12人",
    price: "688元/小时起",
  },
  {
    id: "summer",
    name: "夏季主题包间",
    icon: <Sun className="h-5 w-5 text-orange-500" />,
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
    badgeColor: "bg-blue-100 text-blue-800",
    description: "以明亮、热情为主题，采用蓝色和橙色为主色调，搭配沙滩、海洋元素的装饰品",
    features: [
      "利用灯光效果模拟夏日阳光，增加室内的活力感",
      "融入夏季节气的特点，如小暑、大暑等，通过装饰和活动展现夏季的传统习俗",
      "提供与夏季相关的服务项目，如冰镇饮品、冷餐等",
      "背景音乐以欢快、热情的夏季主题音乐为主",
    ],
    capacity: "可容纳10-15人",
    price: "788元/小时起",
  },
  {
    id: "autumn",
    name: "秋季主题包间",
    icon: <Cloud className="h-5 w-5 text-amber-500" />,
    color: "bg-amber-50 border-amber-200",
    textColor: "text-amber-800",
    badgeColor: "bg-amber-100 text-amber-800",
    description: "以丰收、温暖为主题，采用金黄色和红色为主色调，搭配枫叶、果实等元素的装饰",
    features: [
      "模拟秋日的田园风光，使用木质家具和暖色调灯光，营造温馨氛围",
      "结合秋季节气的特点，如白露、秋分等，通过装饰和活动展现秋季的传统习俗",
      "提供与秋季相关的特色服务，如热红酒、南瓜派等",
      "背景音乐以舒缓、温暖的秋季主题音乐为主",
    ],
    capacity: "可容纳8-12人",
    price: "688元/小时起",
  },
  {
    id: "winter",
    name: "冬季主题包间",
    icon: <Snowflake className="h-5 w-5 text-blue-500" />,
    color: "bg-slate-50 border-slate-200",
    textColor: "text-slate-800",
    badgeColor: "bg-slate-100 text-slate-800",
    description: "以寒冷、宁静为主题，采用白色和银色为主色调，搭配雪花、圣诞树等元素的装饰",
    features: [
      "利用灯光效果模拟冬日雪景，增加室内的浪漫感",
      "融入冬季节气的特点，如冬至、小寒等，通过装饰和活动展现冬季的传统习俗",
      "提供与冬季相关的服务项目，如热巧克力、烤火腿等",
      "背景音乐以宁静、温馨的冬季主题音乐为主",
    ],
    capacity: "可容纳8-12人",
    price: "788元/小时起",
  },
]

// 节气主题包间数据
const solarTermRooms = [
  // 春季节气
  {
    id: "lichun",
    name: "立春",
    season: "spring",
    displayName: "春意盎然",
    description: "象征着新的一年开始，万物复苏，春意盎然",
    features: ["绿色植物装饰", "春卷制作体验", "春茶品鉴"],
  },
  {
    id: "yushui",
    name: "雨水",
    season: "spring",
    displayName: "春雨绵绵",
    description: "雨水增多，气温回升，万物开始萌发生机",
    features: ["雨滴元素装饰", "茶艺表演", "春笋美食"],
  },
  {
    id: "jingzhe",
    name: "惊蛰",
    season: "spring",
    displayName: "春雷唤醒",
    description: "春雷始鸣，惊醒蛰伏的昆虫，大地一片生机",
    features: ["蝴蝶装饰元素", "花草茶品鉴", "春笋炒肉"],
  },
  {
    id: "chunfen",
    name: "春分",
    season: "spring",
    displayName: "阴阳平衡",
    description: "昼夜平分，阴阳相半，是春季的中点",
    features: ["阴阳平衡装饰", "春分特色点心", "平衡养生茶"],
  },
  {
    id: "qingming",
    name: "清明",
    season: "spring",
    displayName: "追思怀远",
    description: "天气清爽明朗，是祭祖扫墓、踏青郊游的好时节",
    features: ["青团制作体验", "踏青主题装饰", "清明时节雨纷纷主题投影"],
  },
  {
    id: "guyu",
    name: "谷雨",
    season: "spring",
    displayName: "雨润万物",
    description: "雨生百谷，雨水滋润禾苗生长",
    features: ["谷物装饰元素", "春茶品鉴", "雨水音效背景"],
  },

  // 夏季节气
  {
    id: "lixia",
    name: "立夏",
    season: "summer",
    displayName: "夏日序曲",
    description: "夏季的开始，气温显著升高，万物生长旺盛",
    features: ["绿叶成荫装饰", "冰镇绿豆汤", "夏日清凉音乐"],
  },
  {
    id: "xiaoman",
    name: "小满",
    season: "summer",
    displayName: "麦穗初满",
    description: "麦类等夏熟作物籽粒开始饱满",
    features: ["麦穗装饰元素", "小满时节特色点心", "麦田风光投影"],
  },
  {
    id: "mangzhong",
    name: "芒种",
    season: "summer",
    displayName: "忙种忙收",
    description: "农作物开始成熟，同时也是播种的季节",
    features: ["农耕文化装饰", "新麦制品品尝", "农耕音乐背景"],
  },
  {
    id: "xiazhi",
    name: "夏至",
    season: "summer",
    displayName: "日长夜短",
    description: "一年中白昼最长的一天，也是夏季的中点",
    features: ["太阳元素装饰", "夏至养生茶", "冰镇西瓜"],
  },
  {
    id: "xiaoshu",
    name: "小暑",
    season: "summer",
    displayName: "初尝夏热",
    description: "天气开始炎热，但还没到最热的时候",
    features: ["清凉蓝色调装饰", "冰镇饮品", "夏日清凉音乐"],
  },
  {
    id: "dashu",
    name: "大暑",
    season: "summer",
    displayName: "酷暑难耐",
    description: "一年中最热的时期，常有暴雨和雷电",
    features: ["海洋元素装饰", "冰镇甜品", "海浪声背景音效"],
  },

  // 秋季节气
  {
    id: "liqiu",
    name: "立秋",
    season: "autumn",
    displayName: "秋意渐浓",
    description: "秋季的开始，暑气渐退，天气转凉",
    features: ["金色麦穗装饰", "秋季养生茶", "秋风轻拂音效"],
  },
  {
    id: "chushu",
    name: "处暑",
    season: "autumn",
    displayName: "暑去凉来",
    description: "炎热的天气结束，开始转凉",
    features: ["红叶装饰元素", "秋季水果拼盘", "秋日午后音乐"],
  },
  {
    id: "bailu",
    name: "白露",
    season: "autumn",
    displayName: "露珠晶莹",
    description: "天气转凉，早晨草木上有白色露珠",
    features: ["露珠元素装饰", "白露茶点", "晨露音效背景"],
  },
  {
    id: "qiufen",
    name: "秋分",
    season: "autumn",
    displayName: "昼夜均分",
    description: "昼夜平分，阴阳相半，是秋季的中点",
    features: ["阴阳平衡装饰", "秋分特色点心", "平衡养生茶"],
  },
  {
    id: "hanlu",
    name: "寒露",
    season: "autumn",
    displayName: "寒意初现",
    description: "天气更加寒冷，露水带有寒意",
    features: ["枫叶装饰元素", "热红酒", "秋日落叶音效"],
  },
  {
    id: "shuangjiang",
    name: "霜降",
    season: "autumn",
    displayName: "霜华满地",
    description: "天气寒冷，开始有霜冻现象",
    features: ["霜花元素装饰", "暖心甜品", "秋日夕阳投影"],
  },

  // 冬季节气
  {
    id: "lidong",
    name: "立冬",
    season: "winter",
    displayName: "冬日序曲",
    description: "冬季的开始，天气显著变冷",
    features: ["冬日装饰元素", "暖心姜茶", "冬日音乐背景"],
  },
  {
    id: "xiaoxue",
    name: "小雪",
    season: "winter",
    displayName: "瑞雪初降",
    description: "开始降雪，但雪量不大",
    features: ["雪花装饰元素", "热巧克力", "雪花飘落投影"],
  },
  {
    id: "daxue",
    name: "大雪",
    season: "winter",
    displayName: "银装素裹",
    description: "降雪量增多，大地可能被雪覆盖",
    features: ["雪景装饰元素", "暖心火锅", "雪地音效背景"],
  },
  {
    id: "dongzhi",
    name: "冬至",
    season: "winter",
    displayName: "团圆之夜",
    description: "一年中白昼最短的一天，也是冬季的中点",
    features: ["冬至饺子制作体验", "团圆元素装饰", "冬日暖阳投影"],
  },
  {
    id: "xiaohan",
    name: "小寒",
    season: "winter",
    displayName: "寒意渐浓",
    description: "天气寒冷，但还没到最冷的时候",
    features: ["冰晶装饰元素", "暖心甜汤", "冬日壁炉投影"],
  },
  {
    id: "dahan",
    name: "大寒",
    season: "winter",
    displayName: "冰封万里",
    description: "一年中最冷的时期",
    features: ["冰雪装饰元素", "热酒暖身", "冰雪世界投影"],
  },
]

export function ThemeRoomManagement() {
  const [activeTab, setActiveTab] = useState("season")
  const [activeSeason, setActiveSeason] = useState("all")

  // 过滤节气包间
  const filteredSolarTerms =
    activeSeason === "all" ? solarTermRooms : solarTermRooms.filter((room) => room.season === activeSeason)

  return (
    <div className="p-6 animate-fade-in">
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        主题包间管理
      </motion.h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="season" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>四季主题包间</span>
          </TabsTrigger>
          <TabsTrigger value="solar" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>节气主题包间</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="season">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seasonRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`${room.color} border-2`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${room.textColor}`}>
                      {room.icon}
                      <span>{room.name}</span>
                    </CardTitle>
                    <CardDescription>{room.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">特色服务</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {room.features.map((feature, idx) => (
                            <li key={idx} className="text-sm">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <Badge className={room.badgeColor}>{room.capacity}</Badge>
                        <span className="font-semibold">{room.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="solar">
          <div className="mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setActiveSeason("all")}>
                全部节气
              </TabsTrigger>
              <TabsTrigger value="spring" onClick={() => setActiveSeason("spring")}>
                春季节气
              </TabsTrigger>
              <TabsTrigger value="summer" onClick={() => setActiveSeason("summer")}>
                夏季节气
              </TabsTrigger>
              <TabsTrigger value="autumn" onClick={() => setActiveSeason("autumn")}>
                秋季节气
              </TabsTrigger>
              <TabsTrigger value="winter" onClick={() => setActiveSeason("winter")}>
                冬季节气
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSolarTerms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`border-2 ${
                    room.season === "spring"
                      ? "border-green-200 bg-green-50"
                      : room.season === "summer"
                        ? "border-blue-200 bg-blue-50"
                        : room.season === "autumn"
                          ? "border-amber-200 bg-amber-50"
                          : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{room.displayName}</CardTitle>
                      <Badge
                        className={`
                        ${
                          room.season === "spring"
                            ? "bg-green-100 text-green-800"
                            : room.season === "summer"
                              ? "bg-blue-100 text-blue-800"
                              : room.season === "autumn"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-800"
                        }
                      `}
                      >
                        {room.name}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{room.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">特色服务</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {room.features.map((feature, idx) => (
                          <li key={idx} className="text-xs">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
