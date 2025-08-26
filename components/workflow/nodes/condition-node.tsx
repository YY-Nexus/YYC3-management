import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SplitSquareVertical } from "lucide-react"

export function ConditionNode({ data, isConnectable }: { data: any; isConnectable: boolean }) {
  return (
    <Card className="w-[200px] shadow-md border-yellow-200 border-2 bg-yellow-50">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-medium flex items-center">
          <SplitSquareVertical className="h-4 w-4 mr-2 text-yellow-600" />
          {data.title || "条件"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        {data.description && <p className="text-xs text-gray-500">{data.description}</p>}
        <div className="mt-2 text-xs">
          <div className="flex justify-between">
            <span className="text-green-600">是</span>
            <span className="text-red-600">否</span>
          </div>
        </div>
      </CardContent>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: "25%" }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: "75%" }}
        isConnectable={isConnectable}
      />
    </Card>
  )
}
