// 格式化日期时间
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
}

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// 格式化时间
export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// 计算剩余时间
export function getRemainingTime(targetDateString: string): string {
  const now = new Date()
  const targetDate = new Date(targetDateString)
  const diffMs = targetDate.getTime() - now.getTime()

  if (diffMs < 0) {
    return "已超时"
  }

  const diffMins = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60

  if (hours > 0) {
    return `${hours}小时${mins}分钟`
  } else {
    return `${mins}分钟`
  }
}

// 判断日期是否相同（忽略时间）
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
