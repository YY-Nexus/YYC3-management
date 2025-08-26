import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch } from "lucide-react"

export function ForkNode({ data, isConnectable }: { data: any; isConnectable: boolean }) {
  return (
    <Card className="w-[200px] shadow-md border-purple-200 border-2 bg-purple-50">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-medium flex items-center">
          <GitBranch className="h-4 w-4 mr-2 text-purple-600" />
          {data.title || "分支"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        {data.description && <p className="text-xs text-gray-500">{data.description}</p>}
        <div className="mt-2 text-xs">
          <p className="text-purple-600">并行分支: {(data.branches || []).length}</p>
        </div>
      </CardContent>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Card>
  )
}
