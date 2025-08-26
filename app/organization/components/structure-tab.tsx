"use client"

import { Tree, TreeNode } from "@/components/ui/tree"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"
import type { Department } from "../types"
import type React from "react"

interface StructureTabProps {
  departments: Department[]
  isLoading: boolean
  setNewDepartment: (dept: any) => void
  setIsEditing: (editing: boolean) => void
  setEditingId: (id: string | null) => void
  setShowDepartmentDialog: (show: boolean) => void
  editDepartment: (id: string) => void
  confirmDelete: (id: string, type: "employee" | "department" | "position") => void
}

export function StructureTab({
  departments,
  isLoading,
  setNewDepartment,
  setIsEditing,
  setEditingId,
  setShowDepartmentDialog,
  editDepartment,
  confirmDelete,
}: StructureTabProps) {
  // 渲染部门树
  const renderDepartments = (departments: Department[]): React.ReactNode => {
    return departments.map((department) => (
      <TreeNode
        key={department.id}
        label={
          <div className="flex items-center justify-between w-full pr-2">
            <span>
              {department.name} {department.manager && `(负责人: ${department.manager})`}
            </span>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  editDepartment(department.id)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              {department.id !== "1" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    confirmDelete(department.id, "department")
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        }
      >
        {department.children && renderDepartments(department.children)}
      </TreeNode>
    ))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>组织架构</CardTitle>
        <Button
          onClick={() => {
            setNewDepartment({ name: "", manager: "", parentId: "1" })
            setIsEditing(false)
            setEditingId(null)
            setShowDepartmentDialog(true)
          }}
          className="btn-3d"
        >
          <Plus className="h-4 w-4 mr-2" />
          添加部门
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <Tree>{renderDepartments(departments)}</Tree>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
