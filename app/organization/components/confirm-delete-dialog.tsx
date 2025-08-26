"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import type { ItemToDelete } from "../types"

interface ConfirmDeleteDialogProps {
  showDeleteConfirm: boolean
  setShowDeleteConfirm: (show: boolean) => void
  itemToDelete: ItemToDelete | null
  handleDelete: () => void
  isLoading: boolean
}

export function ConfirmDeleteDialog({
  showDeleteConfirm,
  setShowDeleteConfirm,
  itemToDelete,
  handleDelete,
  isLoading,
}: ConfirmDeleteDialogProps) {
  if (!itemToDelete) return null

  const getItemTypeText = () => {
    switch (itemToDelete.type) {
      case "department":
        return "部门"
      case "employee":
        return "员工"
      case "position":
        return "职位"
      default:
        return "项目"
    }
  }

  return (
    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            您确定要删除{getItemTypeText()}"{itemToDelete.name}"吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isLoading}>
            取消
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                删除中...
              </>
            ) : (
              "确认删除"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
