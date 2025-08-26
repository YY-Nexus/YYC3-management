"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Send, Heart, Reply, MoreVertical, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Comment = {
  id: string
  content: string
  author: string
  authorAvatar: string
  createdAt: string
  likes: number
  isLiked: boolean
  replies: Comment[]
}

interface DocumentCommentsProps {
  documentId: string
}

export function DocumentComments({ documentId }: DocumentCommentsProps) {
  const { toast } = useToast()
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      content: "这份报告数据很详细，特别是现金流分析部分很有价值。建议在下次报告中增加同行业对比数据。",
      author: "李经理",
      authorAvatar: "",
      createdAt: "2023-10-16 10:30",
      likes: 3,
      isLiked: false,
      replies: [
        {
          id: "1-1",
          content: "好建议！我会在下个季度的报告中加入行业对比分析。",
          author: "张财务",
          authorAvatar: "",
          createdAt: "2023-10-16 11:15",
          likes: 1,
          isLiked: true,
          replies: [],
        },
      ],
    },
    {
      id: "2",
      content: "第15页的图表似乎有些问题，数据加总不对。请核实一下。",
      author: "王总监",
      authorAvatar: "",
      createdAt: "2023-10-15 16:45",
      likes: 2,
      isLiked: true,
      replies: [],
    },
  ])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: "当前用户",
      authorAvatar: "",
      createdAt: new Date().toLocaleString("zh-CN"),
      likes: 0,
      isLiked: false,
      replies: [],
    }

    setComments([comment, ...comments])
    setNewComment("")
    toast({
      title: "评论已添加",
      description: "您的评论已成功发布",
    })
  }

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      content: replyContent,
      author: "当前用户",
      authorAvatar: "",
      createdAt: new Date().toLocaleString("zh-CN"),
      likes: 0,
      isLiked: false,
      replies: [],
    }

    setComments(
      comments.map((comment) =>
        comment.id === parentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )
    setReplyContent("")
    setReplyTo(null)
    toast({
      title: "回复已添加",
      description: "您的回复已成功发布",
    })
  }

  const handleLike = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(
        comments.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                        isLiked: !reply.isLiked,
                      }
                    : reply,
                ),
              }
            : comment,
        ),
      )
    } else {
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                isLiked: !comment.isLiked,
              }
            : comment,
        ),
      )
    }
  }

  const CommentItem = ({
    comment,
    isReply = false,
    parentId,
  }: { comment: Comment; isReply?: boolean; parentId?: string }) => (
    <div className={`${isReply ? "ml-8 mt-3" : ""}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-sm">{comment.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.author}</span>
              <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit size={14} className="mr-2" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 size={14} className="mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm mb-2">{comment.content}</p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => handleLike(comment.id, isReply, parentId)}
            >
              <Heart size={12} className={comment.isLiked ? "fill-red-500 text-red-500" : ""} />
              <span className="ml-1 text-xs">{comment.likes}</span>
            </Button>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              >
                <Reply size={12} />
                <span className="ml-1 text-xs">回复</span>
              </Button>
            )}
          </div>
          {replyTo === comment.id && (
            <div className="mt-3">
              <div className="flex gap-2">
                <Textarea
                  placeholder="写下您的回复..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
                <div className="flex flex-col gap-1">
                  <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                    <Send size={14} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setReplyTo(null)}>
                    取消
                  </Button>
                </div>
              </div>
            </div>
          )}
          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} parentId={comment.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={20} />
          评论 ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-sm">我</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="写下您的评论..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                <Send size={14} className="mr-1" />
                发表评论
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">暂无评论</h3>
            <p className="text-muted-foreground">成为第一个评论的人吧！</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
