"use client"

import type React from "react"

interface OrganizationChartNode {
  name: string
  children?: OrganizationChartNode[]
}

interface OrganizationChartProps {
  data?: OrganizationChartNode
}

export const OrganizationChart: React.FC<OrganizationChartProps> = ({ data }) => {
  const renderNode = (node: OrganizationChartNode, level = 0) => {
    return (
      <li key={node.name}>
        <div
          style={{ marginLeft: level * 20 + "px" }}
          className="py-2 px-4 rounded-md bg-gray-100 border border-gray-300 shadow-sm"
        >
          {node.name}
        </div>
        {node.children && <ul>{node.children.map((child) => renderNode(child, level + 1))}</ul>}
      </li>
    )
  }

  // 示例数据，可以替换成从 props 传入的数据
  const exampleData = {
    name: "总经理",
    children: [
      {
        name: "行政部",
        children: [{ name: "行政主管" }, { name: "行政助理" }],
      },
      {
        name: "财务部",
        children: [{ name: "财务经理" }, { name: "会计" }, { name: "出纳" }],
      },
      {
        name: "营销部",
        children: [{ name: "营销总监" }, { name: "营销专员" }, { name: "广告策划" }],
      },
    ],
  }

  return (
    <div className="organization-chart">
      <ul>{exampleData.children?.map((child) => renderNode(child))}</ul>
    </div>
  )
}
