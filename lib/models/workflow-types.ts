// 岗位级别定义
export type PositionLevel = "员工" | "直属管理" | "门店副总" | "总经理"

// 任务状态定义
export type TaskStatus =
  | "pending" // 待处理
  | "in_progress" // 处理中
  | "completed" // 已完成
  | "escalated" // 已升级
  | "overdue" // 已超时
  | "warning" // 警告状态

// 提醒类型定义
export type NotificationType =
  | "reminder" // 常规提醒
  | "escalation" // 升级提醒
  | "warning" // 警告提醒
  | "completion" // 完成提醒

// 工作流节点定义
export interface WorkflowNode {
  id: string
  title: string // 节点标题
  description: string // 节点描述
  category: string // 节点分类
  responsibleLevel: PositionLevel // 负责岗位
  timeLimit: number // 时间限制(分钟)
  reminderBefore: number // 提前提醒时间(分钟)
  escalationAfter: number // 升级时间(分钟)
  warningAfter: number // 警告时间(分钟)
  dependsOn?: string[] // 依赖的节点ID
}

// 工作流任务定义
export interface WorkflowTask {
  id: string
  nodeId: string // 关联的节点ID
  title: string // 任务标题
  description: string // 任务描述
  status: TaskStatus // 任务状态
  assignedTo: PositionLevel // 分配给哪个岗位
  originalAssignee: PositionLevel // 原始负责人
  scheduledTime: string // 计划执行时间
  reminderTime: string // 提醒时间
  escalationTime: string // 升级时间
  warningTime: string // 警告时间
  startTime?: string // 开始时间
  completionTime?: string // 完成时间
  notes?: string // 备注
  category: string // 分类
}

// 提醒记录定义
export interface NotificationRecord {
  id: string
  taskId: string // 关联的任务ID
  type: NotificationType // 提醒类型
  message: string // 提醒消息
  sentTo: PositionLevel // 发送给哪个岗位
  sentTime: string // 发送时间
  isRead: boolean // 是否已读
  actionTaken?: string // 采取的行动
  actionTime?: string // 行动时间
}

// 工作流模板定义
export interface WorkflowTemplate {
  id: string
  name: string // 模板名称
  description: string // 模板描述
  category: string // 模板分类
  nodes: WorkflowNode[] // 节点列表
  createdAt: string // 创建时间
  updatedAt: string // 更新时间
}

// 工作流实例定义
export interface WorkflowInstance {
  id: string
  templateId: string // 关联的模板ID
  name: string // 实例名称
  description: string // 实例描述
  status: "active" | "completed" | "cancelled" // 实例状态
  tasks: WorkflowTask[] // 任务列表
  startTime: string // 开始时间
  endTime?: string // 结束时间
  createdBy: string // 创建人
  createdAt: string // 创建时间
  updatedAt: string // 更新时间
}
