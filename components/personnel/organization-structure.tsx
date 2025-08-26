"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Printer } from "lucide-react"
import { departmentData } from "@/data/department-data"
import { DepartmentDetailDialog } from "@/components/personnel/department-detail-dialog"

// 组织节点组件
interface OrgNodeProps {
  name: string
  level: number
  color?: string
  isRoot?: boolean
  onClick?: () => void
}

function OrgNode({ name, level, color = "gray", isRoot = false, onClick }: OrgNodeProps) {
  // 根据级别和颜色确定样式
  const getNodeStyle = () => {
    const baseStyle = "p-3 rounded-lg shadow-md text-center cursor-pointer transition-all duration-300 hover:shadow-lg"

    if (isRoot) {
      return `${baseStyle} bg-blue-500 text-white font-bold border-2 border-blue-600 min-w-[200px]`
    }

    const colorMap: Record<string, string> = {
      red: "bg-red-100 border-red-500 text-red-800",
      yellow: "bg-yellow-100 border-yellow-500 text-yellow-800",
      green: "bg-green-100 border-green-500 text-green-800",
      blue: "bg-blue-100 border-blue-500 text-blue-800",
      purple: "bg-purple-100 border-purple-500 text-purple-800",
      orange: "bg-orange-100 border-orange-500 text-orange-800",
      emerald: "bg-emerald-100 border-emerald-500 text-emerald-800",
      cyan: "bg-cyan-100 border-cyan-500 text-cyan-800",
      indigo: "bg-indigo-100 border-indigo-500 text-indigo-800",
      gray: "bg-gray-100 border-gray-500 text-gray-800",
    }

    const sizeClass = level === 1 ? "min-w-[150px]" : "min-w-[120px]"
    const fontClass = level === 1 ? "font-semibold" : ""

    return `${baseStyle} ${colorMap[color]} border ${sizeClass} ${fontClass}`
  }

  return (
    <div className={getNodeStyle()} onClick={onClick}>
      {name}
    </div>
  )
}

export function OrganizationStructure() {
  const [zoom, setZoom] = useState(100)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 150))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDepartmentClick = (department: any) => {
    setSelectedDepartment(department)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  // 查找部门数据
  const findDepartment = (name: string) => {
    return (
      departmentData.find((dept) => dept.name === name) || {
        name,
        description: "部门信息",
        manager: "未指定",
        employeeCount: 0,
      }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Badge variant="outline" className="h-9 px-3">
          {zoom}%
        </Badge>
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          打印
        </Button>
      </div>

      <div className="overflow-auto border rounded-lg p-4" style={{ minHeight: "600px" }}>
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          className="transition-transform duration-300"
        >
          <div className="flex flex-col items-center">
            <OrgNode
              name="商会KTV娱乐会所"
              level={0}
              isRoot={true}
              onClick={() => handleDepartmentClick(findDepartment("商会KTV娱乐会所"))}
            />
            <div className="w-0.5 h-8 bg-gray-300"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <OrgNode
                  name="行政部"
                  level={1}
                  color="red"
                  onClick={() => handleDepartmentClick(findDepartment("行政部"))}
                />
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="grid grid-cols-2 gap-4">
                  <OrgNode
                    name="部门经理"
                    level={2}
                    color="red"
                    onClick={() =>
                      handleDepartmentClick({ name: "部门经理", description: "行政部门经理", position: "管理职位" })
                    }
                  />
                  <OrgNode
                    name="行政助理"
                    level={2}
                    color="red"
                    onClick={() =>
                      handleDepartmentClick({ name: "行政助理", description: "行政部助理", position: "行政职位" })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <OrgNode
                  name="财务部"
                  level={1}
                  color="yellow"
                  onClick={() => handleDepartmentClick(findDepartment("财务部"))}
                />
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="grid grid-cols-3 gap-4">
                  <OrgNode
                    name="财务经理"
                    level={2}
                    color="yellow"
                    onClick={() =>
                      handleDepartmentClick({ name: "财务经理", description: "财务部门经理", position: "管理职位" })
                    }
                  />
                  <OrgNode
                    name="会计"
                    level={2}
                    color="yellow"
                    onClick={() =>
                      handleDepartmentClick({ name: "会计", description: "财务部会计", position: "财务职位" })
                    }
                  />
                  <OrgNode
                    name="出纳"
                    level={2}
                    color="yellow"
                    onClick={() =>
                      handleDepartmentClick({ name: "出纳", description: "财务部出纳", position: "财务职位" })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <OrgNode
                  name="营销部"
                  level={1}
                  color="green"
                  onClick={() => handleDepartmentClick(findDepartment("营销部"))}
                />
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="grid grid-cols-3 gap-4">
                  <OrgNode
                    name="营销总监"
                    level={2}
                    color="green"
                    onClick={() =>
                      handleDepartmentClick({ name: "营销总监", description: "营销部门总监", position: "管理职位" })
                    }
                  />
                  <OrgNode
                    name="营销专员"
                    level={2}
                    color="green"
                    onClick={() =>
                      handleDepartmentClick({ name: "营销专员", description: "营销部专员", position: "营销职位" })
                    }
                  />
                  <OrgNode
                    name="广告策划"
                    level={2}
                    color="green"
                    onClick={() =>
                      handleDepartmentClick({ name: "广告策划", description: "营销部广告策划", position: "营销职位" })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <OrgNode
                  name="人事部"
                  level={1}
                  color="blue"
                  onClick={() => handleDepartmentClick(findDepartment("人事部"))}
                />
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="grid grid-cols-3 gap-4">
                  <OrgNode
                    name="人力资源经理"
                    level={2}
                    color="blue"
                    onClick={() =>
                      handleDepartmentClick({ name: "人力资源经理", description: "人事部门经理", position: "管理职位" })
                    }
                  />
                  <OrgNode
                    name="招聘专员"
                    level={2}
                    color="blue"
                    onClick={() =>
                      handleDepartmentClick({ name: "招聘专员", description: "人事部招聘专员", position: "人事职位" })
                    }
                  />
                  <OrgNode
                    name="培训专员"
                    level={2}
                    color="blue"
                    onClick={() =>
                      handleDepartmentClick({ name: "培训专员", description: "人事部培训专员", position: "人事职位" })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <OrgNode
                  name="客服部"
                  level={1}
                  color="purple"
                  onClick={() => handleDepartmentClick(findDepartment("客服部"))}
                />
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="grid grid-cols-2 gap-4">
                  <OrgNode
                    name="客服经理"
                    level={2}
                    color="purple"
                    onClick={() =>
                      handleDepartmentClick({ name: "客服经理", description: "客服部门经理", position: "管理职位" })
                    }
                  />
                  <OrgNode
                    name="客服代表"
                    level={2}
                    color="purple"
                    onClick={() =>
                      handleDepartmentClick({ name: "客服代表", description: "客服部客服代表", position: "客服职位" })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <OrgNode
                  name="安保部"
                  level={1}
                  color="orange"
                  onClick={() => handleDepartmentClick(findDepartment("安保部"))}
                />
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="grid grid-cols-2 gap-4">
                  <OrgNode
                    name="安保经理"
                    level={2}
                    color="orange"
                    onClick={() =>
                      handleDepartmentClick({ name: "安保经理", description: "安保部门经理", position: "管理职位" })
                    }
                  />
                  <OrgNode
                    name="安保人员"
                    level={2}
                    color="orange"
                    onClick={() =>
                      handleDepartmentClick({ name: "安保人员", description: "安保部安保人员", position: "安保职位" })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <OrgNode
                  name="管家部"
                  level={1}
                  color="emerald"
                  onClick={() => handleDepartmentClick(findDepartment("管家部"))}
                />
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="grid grid-cols-3 gap-4">
                  <OrgNode
                    name="管家经理"
                    level={2}
                    color="emerald"
                    onClick={() =>
                      handleDepartmentClick({ name: "管家经理", description: "管家部门经理", position: "管理职位" })
                    }
                  />
                  <OrgNode
                    name="金牌管家"
                    level={2}
                    color="emerald"
                    onClick={() =>
                      handleDepartmentClick({ name: "金牌管家", description: "管家部金牌管家", position: "服务职位" })
                    }
                  />
                  <OrgNode
                    name="银牌管家"
                    level={2}
                    color="emerald"
                    onClick={() =>
                      handleDepartmentClick({ name: "银牌管家", description: "管家部银牌管家", position: "服务职位" })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <OrgNode
                  name="后勤部"
                  level={1}
                  color="cyan"
                  onClick={() => handleDepartmentClick(findDepartment("后勤部"))}
                />
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="grid grid-cols-3 gap-4">
                  <OrgNode
                    name="后勤经理"
                    level={2}
                    color="cyan"
                    onClick={() =>
                      handleDepartmentClick({ name: "后勤经理", description: "后勤部门经理", position: "管理职位" })
                    }
                  />
                  <OrgNode
                    name="保洁员"
                    level={2}
                    color="cyan"
                    onClick={() =>
                      handleDepartmentClick({ name: "保洁员", description: "后勤部保洁员", position: "后勤职位" })
                    }
                  />
                  <OrgNode
                    name="技术支持"
                    level={2}
                    color="cyan"
                    onClick={() =>
                      handleDepartmentClick({ name: "技术支持", description: "后勤部技术支持", position: "技术职位" })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <OrgNode
                  name="运营部"
                  level={1}
                  color="indigo"
                  onClick={() => handleDepartmentClick(findDepartment("运营部"))}
                />
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="grid grid-cols-3 gap-4">
                  <OrgNode
                    name="运营经理"
                    level={2}
                    color="indigo"
                    onClick={() =>
                      handleDepartmentClick({ name: "运营经理", description: "运营部门经理", position: "管理职位" })
                    }
                  />
                  <OrgNode
                    name="出品部"
                    level={2}
                    color="indigo"
                    onClick={() =>
                      handleDepartmentClick({ name: "出品部", description: "运营部出品部", position: "运营职位" })
                    }
                  />
                  <OrgNode
                    name="服务员"
                    level={2}
                    color="indigo"
                    onClick={() =>
                      handleDepartmentClick({ name: "服务员", description: "运营部服务员", position: "服务职位" })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedDepartment && (
        <DepartmentDetailDialog isOpen={isDialogOpen} onClose={handleCloseDialog} department={selectedDepartment} />
      )}
    </div>
  )
}
