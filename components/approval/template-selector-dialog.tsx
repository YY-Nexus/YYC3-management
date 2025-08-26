"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Calendar, CreditCard, ShoppingCart, FileText, Clock, GraduationCap, Plane, Laptop, Star } from "lucide-react"
import {
  approvalTemplates,
  getTemplateCategories,
  getPopularTemplates,
  type ApprovalTemplate,
} from "@/data/approval-templates"

interface TemplateSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: ApprovalTemplate) => void
}

export function TemplateSelectorDialog({ open, onOpenChange, onSelectTemplate }: TemplateSelectorDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("popular")

  const categories = getTemplateCategories()
  const popularTemplates = getPopularTemplates()

  // 根据搜索查询过滤模板
  const filteredTemplates = searchQuery
    ? approvalTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  // 获取图标组件
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "calendar":
        return <Calendar className="h-5 w-5" />
      case "credit-card":
        return <CreditCard className="h-5 w-5" />
      case "shopping-cart":
        return <ShoppingCart className="h-5 w-5" />
      case "file-text":
        return <FileText className="h-5 w-5" />
      case "clock":
        return <Clock className="h-5 w-5" />
      case "graduation-cap":
        return <GraduationCap className="h-5 w-5" />
      case "plane":
        return <Plane className="h-5 w-5" />
      case "laptop":
        return <Laptop className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  // 模板卡片组件
  const TemplateCard = ({ template }: { template: ApprovalTemplate }) => (
    <div
      className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors"
      onClick={() => onSelectTemplate(template)}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {getIconComponent(template.icon)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{template.name}</h3>
            {template.popular && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> 热门
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{template.category}</Badge>
            {template.estimatedDuration && (
              <span className="text-xs text-muted-foreground">预计审批时长: {template.estimatedDuration}小时</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>选择审批模板</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索模板..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery ? (
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-medium mb-3">搜索结果</h3>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => <TemplateCard key={template.id} template={template} />)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>未找到匹配的模板</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="popular">热门模板</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="popular" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {popularTemplates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="flex-1 overflow-hidden">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {approvalTemplates
                      .filter((template) => template.category === category)
                      .map((template) => (
                        <TemplateCard key={template.id} template={template} />
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        )}

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
