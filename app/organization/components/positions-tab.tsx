"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Position } from "../types"

interface PositionsTabProps {
  positions: Position[]
  isLoading: boolean
  setNewPosition: (position: Position) => void
  setTempResponsibilities: (responsibilities: string[]) => void
  setTempRequirements: (requirements: string[]) => void
  setIsEditing: (isEditing: boolean) => void
  setEditingId: (id: string) => void
  setShowPositionDialog: (show: boolean) => void
  editPosition: (id: string) => void
  confirmDelete: (id: string, type: "employee" | "department" | "position") => void
}

export function PositionsTab({
  positions,
  isLoading,
  setNewPosition,
  setTempResponsibilities,
  setTempRequirements,
  setIsEditing,
  setEditingId,
  setShowPositionDialog,
  editPosition,
  confirmDelete,
}: PositionsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPositions = positions.filter(
    (position) =>
      position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddPosition = () => {
    setNewPosition({
      id: "",
      title: "",
      department: "",
      responsibilities: [],
      requirements: [],
      salary: {
        min: 0,
        max: 0,
      },
      status: "active",
    })
    setTempResponsibilities([])
    setTempRequirements([])
    setIsEditing(false)
    setEditingId("")
    setShowPositionDialog(true)
  }

  const handleEditPosition = (id: string) => {
    editPosition(id)
  }

  const handleDeletePosition = (id: string) => {
    confirmDelete(id, "position")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索职位..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddPosition} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>添加职位</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))
        ) : filteredPositions.length > 0 ? (
          filteredPositions.map((position) => (
            <Card key={position.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{position.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditPosition(position.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeletePosition(position.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{position.department}</Badge>
                  <Badge variant={position.status === "active" ? "default" : "secondary"}>
                    {position.status === "active" ? "招聘中" : "已关闭"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="text-sm">
                  <div className="font-medium mb-1">薪资范围</div>
                  <div className="text-muted-foreground mb-3">
                    {position.salary.min.toLocaleString()} - {position.salary.max.toLocaleString()} 元/月
                  </div>

                  <div className="font-medium mb-1">主要职责</div>
                  <ul className="list-disc list-inside text-muted-foreground mb-3">
                    {position.responsibilities.slice(0, 2).map((resp, i) => (
                      <li key={i} className="truncate">
                        {resp}
                      </li>
                    ))}
                    {position.responsibilities.length > 2 && <li>...</li>}
                  </ul>

                  <div className="font-medium mb-1">任职要求</div>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {position.requirements.slice(0, 2).map((req, i) => (
                      <li key={i} className="truncate">
                        {req}
                      </li>
                    ))}
                    {position.requirements.length > 2 && <li>...</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">未找到匹配的职位</div>
        )}
      </div>
    </div>
  )
}
