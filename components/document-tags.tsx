"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Plus, X, Tag } from "lucide-react"

interface DocumentTagsProps {
  documentId: string
  tags: string[]
}

export function DocumentTags({ documentId, tags: initialTags }: DocumentTagsProps) {
  const { toast } = useToast()
  const [tags, setTags] = useState<string[]>(initialTags)
  const [newTag, setNewTag] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddTag = () => {
    if (!newTag.trim()) return
    if (tags.includes(newTag.trim())) {
      toast({
        title: "标签已存在",
        description: "该标签已经添加过了",
        variant: "destructive",
      })
      return
    }

    setTags([...tags, newTag.trim()])
    setNewTag("")
    setIsAdding(false)
    toast({
      title: "标签已添加",
      description: `标签"${newTag.trim()}"已成功添加`,
    })
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
    toast({
      title: "标签已移除",
      description: `标签"${tagToRemove}"已被移除`,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTag()
    } else if (e.key === "Escape") {
      setIsAdding(false)
      setNewTag("")
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            <Tag size={12} />
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleRemoveTag(tag)}
            >
              <X size={10} />
            </Button>
          </Badge>
        ))}
        {tags.length === 0 && !isAdding && <p className="text-sm text-muted-foreground">暂无标签</p>}
      </div>

      {isAdding ? (
        <div className="flex gap-2">
          <Input
            placeholder="输入标签名称"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyPress}
            className="h-8 text-sm"
            autoFocus
          />
          <Button size="sm" onClick={handleAddTag} disabled={!newTag.trim()}>
            添加
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAdding(false)
              setNewTag("")
            }}
          >
            取消
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setIsAdding(true)} className="h-8">
          <Plus size={14} className="mr-1" />
          添加标签
        </Button>
      )}
    </div>
  )
}
