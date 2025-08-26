"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, FileDown } from "lucide-react"

// 模拟考勤数据
const generateAttendanceData = (employeeId: string, month: Date) => {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

  const attendanceTypes = ["正常", "迟到", "早退", "缺勤", "请假", "出差"]
  const attendanceTypeClasses = {
    正常: "bg-green-50 text-green-700 border-green-200",
    迟到: "bg-yellow-50 text-yellow-700 border-yellow-200",
    早退: "bg-orange-50 text-orange-700 border-orange-200",
    缺勤: "bg-red-50 text-red-700 border-red-200",
    请假: "bg-blue-50 text-blue-700 border-blue-200",
    出差: "bg-purple-50 text-purple-700 border-purple-200",
  }

  const records = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6

    if (isWeekend) {
      records.push({
        date: date.toISOString().split("T")[0],
        type: "休息日",
        checkIn: null,
        checkOut: null,
        workHours: 0,
        remark: "周末休息",
      })
    } else {
      // 随机生成考勤类型，但大部分是正常的
      const randomIndex = Math.random() < 0.8 ? 0 : Math.floor(Math.random() * attendanceTypes.length)
      const type = attendanceTypes[randomIndex]

      let checkIn = null
      let checkOut = null
      let workHours = 0
      let remark = ""

      if (type === "正常") {
        // 正常上下班时间有小波动
        const checkInHour = 8 + Math.floor(Math.random() * 2)
        const checkInMinute = Math.floor(Math.random() * 30)
        checkIn = `${checkInHour.toString().padStart(2, "0")}:${checkInMinute.toString().padStart(2, "0")}`

        const checkOutHour = 17 + Math.floor(Math.random() * 2)
        const checkOutMinute = Math.floor(Math.random() * 30)
        checkOut = `${checkOutHour.toString().padStart(2, "0")}:${checkOutMinute.toString().padStart(2, "0")}`

        workHours = checkOutHour - checkInHour + (checkOutMinute - checkInMinute) / 60
        workHours = Math.round(workHours * 10) / 10
      } else if (type === "迟到") {
        const checkInHour = 9 + Math.floor(Math.random() * 2)
        const checkInMinute = Math.floor(Math.random() * 30)
        checkIn = `${checkInHour.toString().padStart(2, "0")}:${checkInMinute.toString().padStart(2, "0")}`

        const checkOutHour = 17 + Math.floor(Math.random() * 2)
        const checkOutMinute = Math.floor(Math.random() * 30)
        checkOut = `${checkOutHour.toString().padStart(2, "0")}:${checkOutMinute.toString().padStart(2, "0")}`

        workHours = checkOutHour - checkInHour + (checkOutMinute - checkInMinute) / 60
        workHours = Math.round(workHours * 10) / 10
        remark = "迟到"
      } else if (type === "早退") {
        const checkInHour = 8 + Math.floor(Math.random() * 2)
        const checkInMinute = Math.floor(Math.random() * 30)
        checkIn = `${checkInHour.toString().padStart(2, "0")}:${checkInMinute.toString().padStart(2, "0")}`

        const checkOutHour = 16 + Math.floor(Math.random() * 1)
        const checkOutMinute = Math.floor(Math.random() * 30)
        checkOut = `${checkOutHour.toString().padStart(2, "0")}:${checkOutMinute.toString().padStart(2, "0")}`

        workHours = checkOutHour - checkInHour + (checkOutMinute - checkInMinute) / 60
        workHours = Math.round(workHours * 10) / 10
        remark = "早退"
      } else if (type === "缺勤") {
        remark = "未打卡"
      } else if (type === "请假") {
        remark = "病假"
      } else if (type === "出差") {
        checkIn = "09:00"
        checkOut = "18:00"
        workHours = 8
        remark = "外地出差"
      }

      records.push({
        date: date.toISOString().split("T")[0],
        type,
        checkIn,
        checkOut,
        workHours,
        remark,
      })
    }
  }

  return { records, typeClasses: attendanceTypeClasses }
}

interface EmployeeAttendanceProps {
  employeeId: string
}

export function EmployeeAttendance({ employeeId }: EmployeeAttendanceProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"calendar" | "list">("list")

  // 获取当前月份的考勤数据
  const { records, typeClasses } = generateAttendanceData(employeeId, date)

  // 计算考勤统计
  const stats = records.reduce(
    (acc, record) => {
      if (!acc[record.type]) {
        acc[record.type] = 0
      }
      acc[record.type]++
      return acc
    },
    {} as Record<string, number>,
  )

  // 格式化日期显示
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long" })
  }

  // 切换到上个月
  const prevMonth = () => {
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() - 1)
    setDate(newDate)
  }

  // 切换到下个月
  const nextMonth = () => {
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() + 1)
    setDate(newDate)
  }

  // 获取日历上显示的考勤状态
  const getDayAttendance = (day: Date) => {
    const dateString = day.toISOString().split("T")[0]
    return records.find((record) => record.date === dateString)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">{formatMonthYear(date)}</h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(value: "calendar" | "list") => setView(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择视图" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calendar">日历视图</SelectItem>
              <SelectItem value="list">列表视图</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([type, count]) => (
          <Card key={type}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{type}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <Badge variant="outline" className={typeClasses[type as keyof typeof typeClasses]}>
                  {type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {view === "calendar" ? (
        <Card>
          <CardHeader>
            <CardTitle>考勤日历</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
              components={{
                DayContent: ({ day }) => {
                  const attendance = getDayAttendance(day)
                  return (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div>{day.getDate()}</div>
                      {attendance && attendance.type !== "休息日" && (
                        <div
                          className={`text-xs mt-1 px-1 rounded ${typeClasses[attendance.type as keyof typeof typeClasses]}`}
                        >
                          {attendance.type}
                        </div>
                      )}
                    </div>
                  )
                },
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>考勤记录</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日期</TableHead>
                  <TableHead>考勤状态</TableHead>
                  <TableHead>上班时间</TableHead>
                  <TableHead>下班时间</TableHead>
                  <TableHead>工时</TableHead>
                  <TableHead>备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={typeClasses[record.type as keyof typeof typeClasses]}>
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.checkIn ? (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3 text-gray-500" />
                          {record.checkIn}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {record.checkOut ? (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3 text-gray-500" />
                          {record.checkOut}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{record.workHours || "-"}</TableCell>
                    <TableCell>{record.remark || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
