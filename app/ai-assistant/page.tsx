"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Loader2,
  CheckCircle,
  XCircle,
  X,
  Eye,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  FileIcon as FilePdf,
  FileIcon,
  Upload,
  Smartphone,
  History,
  RefreshCw,
  Trash2,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Message = {
  id: number
  sender: "user" | "ai"
  content: string
  timestamp: string
}

type UploadStatus = "idle" | "uploading" | "success" | "error"

// 文件历史记录类型
type FileHistoryItem = {
  id: string
  name: string
  type: string
  size: number
  uploadTime: string
  uploadDate: string
  blob?: Blob
  url?: string
}

// 文件上传配置
const FILE_SIZE_LIMIT = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "text/plain",
]
const ALLOWED_FILE_EXTENSIONS = ".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
const MAX_HISTORY_ITEMS = 20 // 最多保存20条历史记录

export default function AIAssistant() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "ai", content: "你好！我是你的AI助理。有什么我可以帮助你的吗？", timestamp: getCurrentTime() },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 文件上传进度状态
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 拖放状态
  const [isDragging, setIsDragging] = useState(false)

  // 文件预览状态
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")
  const [previewType, setPreviewType] = useState("")
  const [previewName, setPreviewName] = useState("")
  const [textContent, setTextContent] = useState("")

  // 文件历史记录状态
  const [fileHistory, setFileHistory] = useState<FileHistoryItem[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyPreviewItem, setHistoryPreviewItem] = useState<FileHistoryItem | null>(null)

  // 响应式设计
  const isMobile = useMediaQuery("(max-width: 640px)")

  // 加载历史记录
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem("fileUploadHistory")
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory) as FileHistoryItem[]
          // 过滤掉没有必要字段的记录
          const validHistory = parsedHistory.filter((item) => item.id && item.name && item.type && item.uploadTime)
          setFileHistory(validHistory)
        }
      } catch (error) {
        console.error("加载文件历史记录失败:", error)
        // 如果加载失败，重置历史记录
        localStorage.removeItem("fileUploadHistory")
      }
    }

    loadHistory()
  }, [])

  // 保存历史记录到localStorage
  useEffect(() => {
    if (fileHistory.length > 0) {
      try {
        // 只保存必要的信息，不保存blob和url
        const historyToSave = fileHistory.map(({ id, name, type, size, uploadTime, uploadDate }) => ({
          id,
          name,
          type,
          size,
          uploadTime,
          uploadDate,
        }))
        localStorage.setItem("fileUploadHistory", JSON.stringify(historyToSave))
      } catch (error) {
        console.error("保存文件历史记录失败:", error)
      }
    }
  }, [fileHistory])

  // 自动滚动到最新消息
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 清理上传计时器和预览URL
  useEffect(() => {
    return () => {
      if (uploadTimerRef.current) {
        clearTimeout(uploadTimerRef.current)
      }
      // 清理预览URL
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // 设置拖放事件监听
  useEffect(() => {
    const dropZone = dropZoneRef.current
    if (!dropZone) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]
        validateAndSetFile(file)
      }
    }

    dropZone.addEventListener("dragover", handleDragOver)
    dropZone.addEventListener("dragenter", handleDragEnter)
    dropZone.addEventListener("dragleave", handleDragLeave)
    dropZone.addEventListener("drop", handleDrop)

    return () => {
      dropZone.removeEventListener("dragover", handleDragOver)
      dropZone.removeEventListener("dragenter", handleDragEnter)
      dropZone.removeEventListener("dragleave", handleDragLeave)
      dropZone.removeEventListener("drop", handleDrop)
    }
  }, [])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  function getCurrentTime() {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
  }

  function getFormattedDate() {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const day = now.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // 添加文件到历史记录
  const addToFileHistory = (file: File) => {
    // 创建一个新的历史记录项
    const newHistoryItem: FileHistoryItem = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadTime: getCurrentTime(),
      uploadDate: getFormattedDate(),
      blob: file.slice(0), // 创建文件的副本
    }

    // 更新历史记录，保持最新的记录在前面，并限制数量
    setFileHistory((prev) => {
      const newHistory = [newHistoryItem, ...prev].slice(0, MAX_HISTORY_ITEMS)
      return newHistory
    })
  }

  // 从历史记录中删除文件
  const removeFromHistory = (id: string) => {
    setFileHistory((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: "已删除",
      description: "文件已从历史记录中删除",
    })
  }

  // 从历史记录中选择文件
  const selectFromHistory = async (historyItem: FileHistoryItem) => {
    try {
      // 如果历史项有blob，直接使用
      if (historyItem.blob) {
        const file = new File([historyItem.blob], historyItem.name, { type: historyItem.type })
        setSelectedFile(file)
        setHistoryOpen(false)
        toast({
          title: "文件已选择",
          description: `已从历史记录中选择: ${historyItem.name}`,
        })
        return
      }

      // 如果没有blob，尝试从服务器获取（在实际应用中实现）
      toast({
        title: "无法加载文件",
        description: "历史文件数据不可用，请重新上传文件",
        variant: "destructive",
      })
    } catch (error) {
      console.error("选择历史文件失败:", error)
      toast({
        title: "选择失败",
        description: "无法加载历史文件，请重新上传",
        variant: "destructive",
      })
    }
  }

  // 预览历史记录中的文件
  const previewHistoryItem = async (item: FileHistoryItem) => {
    setHistoryPreviewItem(item)

    // 如果有blob，创建预览URL
    if (item.blob) {
      const url = URL.createObjectURL(item.blob)
      setPreviewUrl(url)
      setPreviewType(item.type)
      setPreviewName(item.name)

      // 如果是文本文件，读取内容
      if (item.type === "text/plain") {
        try {
          const text = await item.blob.text()
          setTextContent(text)
        } catch (error) {
          console.error("读取文本内容失败:", error)
          setTextContent("无法读取文件内容")
        }
      }

      setPreviewOpen(true)
    } else {
      toast({
        title: "无法预览",
        description: "历史文件数据不可用，无法预览",
        variant: "destructive",
      })
    }
  }

  // 验证并设置文件
  const validateAndSetFile = (file: File) => {
    // 验证文件类型
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "文件类型不支持",
        description: `请上传以下格式的文件: ${ALLOWED_FILE_EXTENSIONS}`,
        variant: "destructive",
      })
      return false
    }

    // 验证文件大小
    if (file.size > FILE_SIZE_LIMIT) {
      const sizeMB = FILE_SIZE_LIMIT / (1024 * 1024)
      toast({
        title: "文件过大",
        description: `文件大小不能超过 ${sizeMB}MB`,
        variant: "destructive",
      })
      return false
    }

    // 文件验证通过
    setSelectedFile(file)
    toast({
      title: "文件已选择",
      description: `已选择文件: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`,
    })
    return true
  }

  // 预览文件
  const previewFile = async () => {
    if (!selectedFile) return

    setPreviewName(selectedFile.name)
    setPreviewType(selectedFile.type)

    // 处理不同类型的文件预览
    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      setPreviewOpen(true)
    } else if (selectedFile.type === "application/pdf") {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      setPreviewOpen(true)
    } else if (selectedFile.type === "text/plain") {
      const text = await selectedFile.text()
      setTextContent(text)
      setPreviewOpen(true)
    } else {
      // 对于不能直接预览的文件类型，显示文件信息
      toast({
        title: "无法预览",
        description: `${selectedFile.name} 类型的文件无法直接预览`,
      })
    }
  }

  // 模拟文件上传过程
  const simulateFileUpload = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      setUploadStatus("uploading")
      setUploadProgress(0)

      // 根据文件大小调整上传速度，模拟真实上传
      const totalTime = Math.min(3000, 1000 + file.size / 100000)
      const stepTime = 100 // 每100ms更新一次进度
      const steps = totalTime / stepTime
      let currentStep = 0

      const updateProgress = () => {
        currentStep++
        // 使用非线性进度增长，模拟实际上传速度变化
        const newProgress = Math.min(99, Math.round((currentStep / steps) * 100))
        setUploadProgress(newProgress)

        if (currentStep < steps) {
          uploadTimerRef.current = setTimeout(updateProgress, stepTime)
        } else {
          // 模拟网络延迟
          uploadTimerRef.current = setTimeout(() => {
            // 95%概率上传成功，5%概率失败
            const isSuccess = Math.random() > 0.05
            setUploadProgress(100)
            setUploadStatus(isSuccess ? "success" : "error")

            if (isSuccess) {
              // 添加到历史记录
              addToFileHistory(file)

              toast({
                title: "上传成功",
                description: `文件 ${file.name} 已成功上传`,
              })
            } else {
              toast({
                title: "上传失败",
                description: "网络错误，请重试",
                variant: "destructive",
              })
            }

            resolve(isSuccess)
          }, 500)
        }
      }

      // 开始更新进度
      uploadTimerRef.current = setTimeout(updateProgress, stepTime)
    })
  }

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: input + (selectedFile ? `\n[文件: ${selectedFile.name}]` : ""),
      timestamp: getCurrentTime(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 如果有文件，处理文件上传
    let uploadSuccess = true
    if (selectedFile) {
      uploadSuccess = await simulateFileUpload(selectedFile)
      // 无论成功失败，都清除选中的文件
      setSelectedFile(null)
    }

    try {
      // 模拟AI响应延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 这里应该调用实际的AI API来获取回复
      let aiResponse = "我正在分析您的问题..."

      // 如果上传失败，添加相关提示
      if (selectedFile && !uploadSuccess) {
        aiResponse = "您的文件上传失败了，请重试或尝试上传其他文件。"
      }
      // 根据用户输入生成不同的回复
      else if (input.includes("你好") || input.includes("您好")) {
        aiResponse = "您好！很高兴为您服务。请问有什么我可以帮助您的吗？"
      } else if (input.includes("谢谢") || input.includes("感谢")) {
        aiResponse = "不客气！如果您还有其他问题，随时可以问我。"
      } else if (input.includes("工作") || input.includes("任务")) {
        const 时间节点 = "时间节点" // Declare 时间节点
        aiResponse = `关于工作任务，您可以在系统的"${时间节点}"模块查看和管理您的工作进度。需要我为您展示如何使用该功能吗？`
      } else if (input.includes("会议") || input.includes("日程")) {
        const 日程安排 = "日程安排" // Declare 日程安排
        aiResponse = `您可以在"${日程安排}"模块查看和管理您的会议和日程。您需要安排新的会议吗？`
      } else if (input.includes("审批") || input.includes("申请")) {
        const OA审批 = "OA审批" // Declare OA审批
        aiResponse = `关于审批流程，您可以在"${OA审批}"模块提交或查看审批申请。需要我为您展示如何提交新的审批申请吗？`
      } else if (selectedFile && uploadSuccess) {
        aiResponse = `我已收到您上传的文件 ${selectedFile.name}。我正在分析文件内容，稍后会给您回复。`
      } else {
        aiResponse = "我理解了您的问题。让我思考一下如何帮助您解决这个问题..."
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        content: aiResponse,
        timestamp: getCurrentTime(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("AI响应失败:", error)
      toast({
        title: "错误",
        description: "获取AI响应失败，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // 重置上传状态
      setUploadStatus("idle")
      setUploadProgress(0)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      // 停止录音
      setIsRecording(false)
      toast({
        title: "录音已停止",
        description: "正在处理您的语音...",
      })

      // 模拟语音识别
      setTimeout(() => {
        setInput((prev) => prev + "这是通过语音识别转换的文本")
        toast({
          title: "语音识别完成",
          description: "您可以编辑识别结果或直接发送",
        })
      }, 1500)
    } else {
      // 开始录音
      setIsRecording(true)
      toast({
        title: "录音已开始",
        description: "请说话...",
      })
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (validateAndSetFile(file)) {
      e.target.value = "" // 清空输入，允许重新选择相同文件
    } else {
      e.target.value = "" // 清空输入，允许重新选择
    }
  }

  // 渲染上传状态图标
  const renderUploadStatusIcon = () => {
    switch (uploadStatus) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "uploading":
        return <Loader2 className="w-4 h-4 animate-spin" />
      default:
        return null
    }
  }

  // 获取文件图标
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />
    } else if (fileType === "application/pdf") {
      return <FilePdf className="w-5 h-5 text-red-500" />
    } else if (fileType === "text/plain") {
      return <FileText className="w-5 h-5 text-gray-500" />
    } else if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <FileText className="w-5 h-5 text-blue-500" />
    } else {
      return <FileIcon className="w-5 h-5 text-gray-500" />
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // 渲染文件预览内容
  const renderPreviewContent = () => {
    if (previewType.startsWith("image/")) {
      return (
        <div className="flex justify-center">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt={previewName}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      )
    } else if (previewType === "application/pdf") {
      return <iframe src={previewUrl} className="w-full h-[70vh]" title={previewName} />
    } else if (previewType === "text/plain") {
      return (
        <div className="bg-gray-50 p-4 rounded-md max-h-[70vh] overflow-auto">
          <pre className="whitespace-pre-wrap text-sm">{textContent}</pre>
        </div>
      )
    } else {
      return (
        <div className="text-center p-8">
          <FileIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p>无法预览此类型的文件</p>
          <p className="text-sm text-gray-500 mt-2">{previewName}</p>
        </div>
      )
    }
  }

  // 渲染文件历史记录
  const renderFileHistory = () => {
    if (fileHistory.length === 0) {
      return (
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无上传历史</p>
          <p className="text-sm text-gray-400 mt-2">上传文件后将显示在这里</p>
        </div>
      )
    }

    // 按日期分组历史记录
    const groupedHistory: Record<string, FileHistoryItem[]> = {}
    fileHistory.forEach((item) => {
      if (!groupedHistory[item.uploadDate]) {
        groupedHistory[item.uploadDate] = []
      }
      groupedHistory[item.uploadDate].push(item)
    })

    return (
      <ScrollArea className="h-[60vh]">
        {Object.entries(groupedHistory).map(([date, items]) => (
          <div key={date} className="mb-6">
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 text-gray-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">{date}</h3>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(item.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate" title={item.name}>
                            {item.name}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span className="truncate">{formatFileSize(item.size)}</span>
                            <span className="mx-1">•</span>
                            <span>{item.uploadTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => previewHistoryItem(item)}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>预览</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => selectFromHistory(item)}
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>重新使用</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-600"
                                onClick={() => removeFromHistory(item.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>删除</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    )
  }

  return (
    <div className="p-6 h-full flex flex-col bg-wave-pattern">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold gradient-text">AI助理</h1>
          <TabsList>
            <TabsTrigger value="chat">聊天</TabsTrigger>
            <TabsTrigger value="knowledge">知识库</TabsTrigger>
            <TabsTrigger value="settings">设置</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-grow flex flex-col">
          <div
            ref={dropZoneRef}
            className={`flex-grow overflow-auto mb-4 bg-white rounded-lg shadow-inner p-4 tech-border relative ${
              isDragging ? "ring-2 ring-blue-500 bg-blue-50" : "bg-dot-pattern"
            }`}
          >
            {isDragging && (
              <div className="absolute inset-0 bg-blue-50 bg-opacity-80 flex flex-col items-center justify-center z-10">
                <Upload className="w-16 h-16 text-blue-500 mb-4" />
                <p className="text-lg font-medium text-blue-700">释放鼠标上传文件</p>
                <p className="text-sm text-blue-600 mt-2">支持图片、PDF、Word、Excel和文本文件</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"} animate-fade-in`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white rounded-tr-none"
                      : "bg-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="relative">
            {selectedFile && (
              <div className={`absolute ${isMobile ? "-top-24" : "-top-16"} left-0 right-0 bg-blue-50 p-2 rounded-md`}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {getFileIcon(selectedFile.type)}
                    <div className="flex flex-col">
                      <span className="text-sm truncate max-w-[150px] md:max-w-[250px]">{selectedFile.name}</span>
                      <span className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)}KB</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={previewFile}
                      aria-label="预览文件"
                      className="h-7 w-7 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      aria-label="移除文件"
                      className="h-7 w-7 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {uploadStatus !== "idle" && (
                  <div className="mt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {uploadStatus === "uploading"
                          ? "上传中..."
                          : uploadStatus === "success"
                            ? "上传成功"
                            : "上传失败"}
                      </span>
                      <span className="text-xs">{uploadProgress}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={uploadProgress} className="h-2 flex-grow" />
                      {renderUploadStatusIcon()}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isMobile && (
              <div className="mb-2 flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleRecording}
                  className={`${isRecording ? "text-red-500 border-red-500" : ""} h-9 w-9 p-0`}
                  disabled={isLoading || uploadStatus === "uploading"}
                  aria-label={isRecording ? "停止录音" : "开始录音"}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFileUpload}
                  disabled={isLoading || uploadStatus === "uploading"}
                  aria-label="上传文件"
                  className="h-9 w-9 p-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                {isMobile ? (
                  <Drawer open={historyOpen} onOpenChange={setHistoryOpen}>
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isLoading || uploadStatus === "uploading"}
                        aria-label="上传历史"
                        className="h-9 w-9 p-0"
                      >
                        <History className="w-4 h-4" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>文件上传历史</DrawerTitle>
                        <DrawerDescription>查看您之前上传的文件，可以重新使用或删除它们</DrawerDescription>
                      </DrawerHeader>
                      <div className="px-4">{renderFileHistory()}</div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button variant="outline">关闭</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading || uploadStatus === "uploading"}
                  aria-label="移动端优化"
                  className="h-9 w-9 p-0"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-grow relative">
                <Input
                  placeholder="输入你的问题..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || uploadStatus === "uploading"}
                  className={isMobile ? "" : "pr-24"}
                />
                {!isMobile && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleRecording}
                      className={isRecording ? "text-red-500" : ""}
                      disabled={isLoading || uploadStatus === "uploading"}
                      aria-label={isRecording ? "停止录音" : "开始录音"}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleFileUpload}
                      disabled={isLoading || uploadStatus === "uploading"}
                      aria-label="上传文件"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    {!isMobile && (
                      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isLoading || uploadStatus === "uploading"}
                            aria-label="上传历史"
                          >
                            <History className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl w-[90vw]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <History className="w-5 h-5" />
                              文件上传历史
                              <Badge variant="outline" className="ml-2">
                                {fileHistory.length} 个文件
                              </Badge>
                            </DialogTitle>
                          </DialogHeader>
                          {renderFileHistory()}
                          <div className="flex justify-end">
                            <DialogClose asChild>
                              <Button variant="outline">关闭</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept={ALLOWED_FILE_EXTENSIONS}
                  disabled={isLoading || uploadStatus === "uploading"}
                />
              </div>
              <Button
                onClick={handleSend}
                className="btn-3d"
                disabled={isLoading || uploadStatus === "uploading" || (!input.trim() && !selectedFile)}
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                发送
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setInput("如何提高工作效率？")} className="btn-3d">
              如何提高工作效率？
            </Button>
            <Button variant="outline" onClick={() => setInput("帮我安排今天的日程")} className="btn-3d">
              帮我安排今天的日程
            </Button>
            <Button variant="outline" onClick={() => setInput("如何使用系统的OA审批功能？")} className="btn-3d">
              如何使用系统的OA审批功能？
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="flex-grow">
          <Card className="bg-hex-pattern">
            <CardHeader>
              <CardTitle>知识库</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-blue">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">系统使用指南</h3>
                    <p className="text-sm text-gray-500">包含系统各模块的详细使用说明</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-purple">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">常见问题解答</h3>
                    <p className="text-sm text-gray-500">解答用户使用过程中的常见问题</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-cyan">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">公司规章制度</h3>
                    <p className="text-sm text-gray-500">公司各项规章制度的详细说明</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow chinese-theme-bg">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">培训资料</h3>
                    <p className="text-sm text-gray-500">员工培训相关的资料和视频</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="flex-grow">
          <Card className="bg-cloud-pattern">
            <CardHeader>
              <CardTitle>AI助理设置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">AI模型选择</label>
                  <select className="w-full p-2 border rounded">
                    <option value="gpt-3.5">GPT-3.5</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude">Claude</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">语言偏好</label>
                  <select className="w-full p-2 border rounded">
                    <option value="zh">中文</option>
                    <option value="en">英文</option>
                    <option value="auto">自动检测</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">响应风格</label>
                  <select className="w-full p-2 border rounded">
                    <option value="professional">专业</option>
                    <option value="friendly">友好</option>
                    <option value="concise">简洁</option>
                  </select>
                </div>
                <Button className="w-full">保存设置</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 文件预览对话框 */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getFileIcon(previewType)}
              <span className="truncate">{previewName}</span>
            </DialogTitle>
          </DialogHeader>
          {renderPreviewContent()}
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">关闭</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
