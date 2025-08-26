"use client"

import { Button } from "@/components/ui/button"
import { Clock, SplitSquareVertical, GitBranch, GitMerge, Repeat, RotateCcw } from "lucide-react"

interface NodeToolboxProps {
  onAddNode: (type: string) => void
}

export function NodeToolbox({ onAddNode }: NodeToolboxProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">节点类型</h3>

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start border-blue-200 hover:border-blue-300 hover:bg-blue-50"
          onClick={() => onAddNode("task")}
        >
          <Clock className="mr-2 h-4 w-4 text-blue-600" />
          任务节点
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50"
          onClick={() => onAddNode("condition")}
        >
          <SplitSquareVertical className="mr-2 h-4 w-4 text-yellow-600" />
          条件节点
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-purple-200 hover:border-purple-300 hover:bg-purple-50"
          onClick={() => onAddNode("fork")}
        >
          <GitBranch className="mr-2 h-4 w-4 text-purple-600" />
          分支节点
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
          onClick={() => onAddNode("join")}
        >
          <GitMerge className="mr-2 h-4 w-4 text-indigo-600" />
          合并节点
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-green-200 hover:border-green-300 hover:bg-green-50"
          onClick={() => onAddNode("loop_start")}
        >
          <Repeat className="mr-2 h-4 w-4 text-green-600" />
          循环开始
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-green-200 hover:border-green-300 hover:bg-green-50"
          onClick={() => onAddNode("loop_end")}
        >
          <RotateCcw className="mr-2 h-4 w-4 text-green-600" />
          循环结束
        </Button>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-medium mb-2">使用说明</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• 点击左侧按钮添加节点</li>
          <li>• 拖动节点调整位置</li>
          <li>• 连接节点端点创建流程</li>
          <li>• 点击节点编辑属性</li>
          <li>• 条件节点有两个出口（是/否）</li>
          <li>• 循环节点需要配对使用</li>
        </ul>
      </div>
    </div>
  )
}
