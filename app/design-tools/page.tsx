"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { Upload, ImageIcon, Wand2 } from "lucide-react"

export default function DesignTools() {
  const { toast } = useToast()
  const [textToImage, setTextToImage] = useState({
    prompt: "",
    negativePrompt: "",
    style: "realistic",
    size: "512x512",
  })
  const [imageToImage, setImageToImage] = useState({
    image: null,
    prompt: "",
    strength: 0.5,
  })
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleTextToImageChange = (field: string, value: string) => {
    setTextToImage((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageToImageChange = (field: string, value: any) => {
    setImageToImage((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleImageToImageChange("image", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateImage = async (type: "text" | "image") => {
    // 这里应该调用实际的AI图像生成API
    // 为了演示，我们只是显示一个占位图像
    setGeneratedImage("/placeholder.svg?height=512&width=512")
    toast({
      title: "图像生成成功",
      description: "您的图像已经生成完成",
    })
  }

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">推广设计工具</h1>

      <Tabs defaultValue="text-to-image">
        <TabsList>
          <TabsTrigger value="text-to-image">文生图</TabsTrigger>
          <TabsTrigger value="image-to-image">图生图</TabsTrigger>
        </TabsList>

        <TabsContent value="text-to-image">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">提示词</Label>
                <Textarea
                  id="prompt"
                  value={textToImage.prompt}
                  onChange={(e) => handleTextToImageChange("prompt", e.target.value)}
                  placeholder="描述您想要生成的图像..."
                />
              </div>
              <div>
                <Label htmlFor="negativePrompt">反向提示词</Label>
                <Textarea
                  id="negativePrompt"
                  value={textToImage.negativePrompt}
                  onChange={(e) => handleTextToImageChange("negativePrompt", e.target.value)}
                  placeholder="描述您不想在图像中出现的元素..."
                />
              </div>
              <div>
                <Label htmlFor="style">风格</Label>
                <Select value={textToImage.style} onValueChange={(value) => handleTextToImageChange("style", value)}>
                  <SelectTrigger id="style">
                    <SelectValue placeholder="选择风格" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">写实</SelectItem>
                    <SelectItem value="cartoon">卡通</SelectItem>
                    <SelectItem value="abstract">抽象</SelectItem>
                    <SelectItem value="anime">动漫</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="size">尺寸</Label>
                <Select value={textToImage.size} onValueChange={(value) => handleTextToImageChange("size", value)}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="选择尺寸" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256x256">256x256</SelectItem>
                    <SelectItem value="512x512">512x512</SelectItem>
                    <SelectItem value="1024x1024">1024x1024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => generateImage("text")} className="btn-3d">
                <Wand2 className="mr-2 h-4 w-4" /> 生成图像
              </Button>
            </div>
            <div className="flex items-center justify-center bg-gray-100 rounded-lg">
              {generatedImage ? (
                <img src={generatedImage || "/placeholder.svg"} alt="Generated" className="max-w-full max-h-full" />
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="mx-auto h-12 w-12 mb-4" />
                  <p>生成的图像将在这里显示</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="image-to-image">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-upload">上传图片</Label>
                <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
              <div>
                <Label htmlFor="image-prompt">提示词</Label>
                <Textarea
                  id="image-prompt"
                  value={imageToImage.prompt}
                  onChange={(e) => handleImageToImageChange("prompt", e.target.value)}
                  placeholder="描述您想要对图像进行的修改..."
                />
              </div>
              <div>
                <Label htmlFor="strength">修改强度</Label>
                <Slider
                  id="strength"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[imageToImage.strength]}
                  onValueChange={(value) => handleImageToImageChange("strength", value[0])}
                />
                <div className="text-sm text-gray-500 mt-1">{imageToImage.strength.toFixed(1)}</div>
              </div>
              <Button onClick={() => generateImage("image")} className="btn-3d" disabled={!imageToImage.image}>
                <Wand2 className="mr-2 h-4 w-4" /> 生成图像
              </Button>
            </div>
            <div className="flex items-center justify-center bg-gray-100 rounded-lg">
              {imageToImage.image ? (
                <img src={imageToImage.image || "/placeholder.svg"} alt="Uploaded" className="max-w-full max-h-full" />
              ) : generatedImage ? (
                <img src={generatedImage || "/placeholder.svg"} alt="Generated" className="max-w-full max-h-full" />
              ) : (
                <div className="text-center text-gray-500">
                  <Upload className="mx-auto h-12 w-12 mb-4" />
                  <p>上传图片或生成的图像将在这里显示</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
