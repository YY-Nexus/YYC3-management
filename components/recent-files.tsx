import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const recentFiles = [
  { id: 1, title: "项目进度报告", description: "本周项目进度概述", date: "2023-06-15" },
  { id: 2, title: "会议纪要", description: "产品开发会议讨论要点", date: "2023-06-14" },
  { id: 3, title: "市场分析报告", description: "Q2市场趋势分析", date: "2023-06-13" },
]

export function RecentFiles() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>最近文件</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recentFiles.map((file) => (
            <li key={file.id} className="border-b pb-2">
              <h3 className="font-semibold">{file.title}</h3>
              <p className="text-sm text-gray-600">{file.description}</p>
              <p className="text-sm text-red-500">{file.date}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
