import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, User } from "lucide-react"

export function TaskNode({ data, isConnectable }: { data: any; isConnectable: boolean }) {
  return (
    <Card className="w-[200px] shadow-md border-blue-200 border-2">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-medium">{data.title || "任务"}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        {data.description && <p className="text-xs text-gray-500 mb-2">{data.description}</p>}
        {data.responsibleLevel && (
          <div className="flex items-center text-xs text-gray-500">
            <User className="h-3 w-3 mr-1" />
            <span>{data.responsibleLevel}</span>
          </div>
        )}
        {data.timeLimit && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{data.timeLimit}分钟</span>
          </div>
        )}
      </CardContent>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Card>
  )
}
