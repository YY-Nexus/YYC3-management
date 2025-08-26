"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { X, Upload, File, ImageIcon, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

type FileUploaderProps = {
  addWatermark?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  allowedTypes?: string[]
  onFilesChange?: (files: File[]) => void
}

export function FileUploader({
  addWatermark = false,
  maxFiles = 5,
  maxSize = 10, // 10MB
  allowedTypes = [
    "image/*",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  onFilesChange,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return

      // 检查文件数量限制
      if (files.length + selectedFiles.length > maxFiles) {
        toast({
          title: "文件数量超出限制",
          description: `最多只能上传${maxFiles}个文件`,
          variant: "destructive",
        })
        return
      }

      const newFiles: File[] = []
      const newPreviews: string[] = []
      const newProgress: number[] = []

      Array.from(selectedFiles).forEach((file) => {
        // 检查文件类型
        const fileType = file.type
        const isAllowedType = allowedTypes.some((type) => {
          if (type.endsWith("/*")) {
            const category = type.split("/")[0]
            return fileType.startsWith(`${category}/`)
          }
          return type === fileType
        })

        if (!isAllowedType) {
          toast({
            title: "不支持的文件类型",
            description: `文件 "${file.name}" 类型不支持`,
            variant: "destructive",
          })
          return
        }

        // 检查文件大小
        if (file.size > maxSize * 1024 * 1024) {
          toast({
            title: "文件大小超出限制",
            description: `文件 "${file.name}" 超过${maxSize}MB`,
            variant: "destructive",
          })
          return
        }

        newFiles.push(file)

        // 为图片创建预览
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onloadend = () => {
            const previewUrl = reader.result as string
            setPreviews((prev) => [...prev, previewUrl])

            if (addWatermark) {
              addWatermarkToImage(previewUrl, files.length + newPreviews.length)
            }
          }
          reader.readAsDataURL(file)
        } else {
          // 非图片文件使用默认预览
          newPreviews.push("")
        }

        newProgress.push(0)
      })

      setFiles((prev) => [...prev, ...newFiles])
      if (newPreviews.length > 0) {
        setPreviews((prev) => [...prev, ...newPreviews])
      }
      setUploadProgress((prev) => [...prev, ...newProgress])

      if (onFilesChange) {
        onFilesChange([...files, ...newFiles])
      }
    },
    [files, maxFiles, maxSize, allowedTypes, addWatermark, onFilesChange, toast],
  )

  const addWatermarkToImage = (imageSrc: string, index: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        // 添加水印
        ctx.font = `${Math.max(16, img.width / 20)}px Arial`
        ctx.fillStyle = "rgba(200, 200, 200, 0.5)"
        ctx.rotate(-0.2)

        // 重复水印
        const watermarkText = "云³ OS 文档中心"
        const date = new Date().toLocaleDateString("zh-CN")

        for (let i = 0; i < canvas.width * 2; i += 200) {
          for (let j = 0; j < canvas.height * 2; j += 200) {
            ctx.fillText(watermarkText, i, j)
            ctx.fillText(date, i, j + 20)
          }
        }

        // 更新预览
        const watermarkedImage = canvas.toDataURL()
        setPreviews((prev) => {
          const newPreviews = [...prev]
          newPreviews[index] = watermarkedImage
          return newPreviews
        })
      }
      img.src = imageSrc
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
    setUploadProgress((prev) => prev.filter((_, i) => i !== index))

    if (onFilesChange) {
      onFilesChange(files.filter((_, i) => i !== index))
    }
  }

  const simulateUpload = () => {
    if (files.length === 0) {
      toast({
        title: "请先选择文件",
        description: "您需要至少选择一个文件才能上传",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // 模拟上传进度
    const intervals = files.map((_, index) => {
      return setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = [...prev]
          if (newProgress[index] < 100) {
            newProgress[index] += Math.random() * 10
            if (newProgress[index] > 100) newProgress[index] = 100
          }
          return newProgress
        })
      }, 200)
    })

    // 模拟上传完成
    setTimeout(() => {
      intervals.forEach(clearInterval)
      setUploadProgress((prev) => prev.map(() => 100))

      setTimeout(() => {
        setIsUploading(false)
        toast({
          title: "上传成功",
          description: `成功上传了 ${files.length} 个文件`,
        })
      }, 500)
    }, 3000)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileChange(e.dataTransfer.files)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  // 获取文件图标
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />
    } else if (file.type === "application/pdf") {
      return <FileText className="h-6 w-6 text-red-500" />
    } else if (file.type.includes("word")) {
      return <FileText className="h-6 w-6 text-blue-700" />
    } else {
      return <File className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-all text-center",
          isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
          isUploading && "opacity-50 pointer-events-none",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
          accept={allowedTypes.join(",")}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <h3 className="text-lg font-medium">拖放文件到此处或点击上传</h3>
          <p className="text-sm text-gray-500">
            支持 {allowedTypes.map((type) => type.replace("/*", "")).join(", ")} 格式，单个文件最大 {maxSize}MB
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {files.map((file, index) => (
              <div key={index} className="flex items-center p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center flex-1 min-w-0">
                  {getFileIcon(file)}
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                {isUploading ? (
                  <div className="w-24 mr-2">
                    <Progress value={uploadProgress[index]} className="h-2" />
                    <p className="text-xs text-right mt-1">{Math.round(uploadProgress[index])}%</p>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {!isUploading && (
            <div className="flex justify-end">
              <Button onClick={simulateUpload} disabled={files.length === 0}>
                <Upload className="h-4 w-4 mr-2" />
                上传文件
              </Button>
            </div>
          )}
        </div>
      )}

      {previews.some((p) => p) && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map(
            (preview, index) =>
              preview && (
                <div key={index} className="relative group">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ),
          )}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}
