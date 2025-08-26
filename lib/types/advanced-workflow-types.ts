import type { PositionLevel, TaskStatus } from "./workflow-types"

// 条件类型
export type ConditionOperator = "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "not_contains"

// 条件定义
export interface Condition {
  id: string
  field: string // 字段名称，如"status"、"assignee"等
  operator: ConditionOperator
  value: string | number | boolean // 比较值
}

// 条件组（支持AND/OR逻辑）
export interface ConditionGroup {
  id: string
  type: "and" | "or"
  conditions: (Condition | ConditionGroup)[]
}

// 工作流节点类型
export type NodeType = "task" | "condition" | "fork" | "join" | "loop_start" | "loop_end"

// 扩展的工作流节点
export interface AdvancedWorkflowNode {
  id: string
  type: NodeType
  title: string
  description?: string
  category?: string
  responsibleLevel?: PositionLevel
  timeLimit?: number
  reminderBefore?: number
  escalationAfter?: number
  warningAfter?: number

  // 条件节点特有属性
  condition?: Condition | ConditionGroup
  trueTarget?: string // 条件为真时的目标节点ID
  falseTarget?: string // 条件为假时的目标节点ID

  // 分支节点特有属性
  branches?: string[] // 分支目标节点ID列表

  // 循环节点特有属性
  loopCondition?: Condition | ConditionGroup
  loopTarget?: string // 循环体的起始节点ID
  exitTarget?: string // 循环结束后的目标节点ID

  // 通用属性
  nextNode?: string // 下一个节点ID（非条件/分支/循环节点使用）
  formFields?: FormField[] // 节点关联的表单字段

  // 元数据
  x?: number // 在设计器中的X坐标
  y?: number // 在设计器中的Y坐标
}

// 表单字段类型
export type FieldType = "text" | "number" | "date" | "select" | "checkbox" | "radio" | "textarea" | "file"

// 表单字段定义
export interface FormField {
  id: string
  name: string
  label: string
  type: FieldType
  required: boolean
  defaultValue?: any
  options?: { label: string; value: string }[] // 用于select、radio等
  placeholder?: string
  description?: string
  validation?: {
    pattern?: string
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
  }
}

// 高级工作流模板
export interface AdvancedWorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  nodes: AdvancedWorkflowNode[]
  startNodeId: string // 起始节点ID
  variables: { name: string; type: string; defaultValue?: any }[] // 工作流变量
  createdAt: string
  updatedAt: string
  createdBy: string
  version: number
  isPublished: boolean
}

// 工作流实例中的表单数据
export interface FormData {
  [fieldId: string]: any
}

// 高级工作流实例
export interface AdvancedWorkflowInstance {
  id: string
  templateId: string
  name: string
  description: string
  status: "active" | "completed" | "cancelled" | "suspended"
  currentNodeIds: string[] // 当前活动的节点ID（可能有多个）
  variables: { [name: string]: any } // 工作流变量的值
  formData: { [nodeId: string]: FormData } // 各节点的表单数据
  history: {
    nodeId: string
    enteredAt: string
    exitedAt?: string
    assignedTo: string
    status: TaskStatus
    formData?: FormData
    notes?: string
  }[]
  startTime: string
  endTime?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

// 工作流执行上下文
export interface WorkflowExecutionContext {
  instance: AdvancedWorkflowInstance
  template: AdvancedWorkflowTemplate
  currentUser: {
    id: string
    name: string
    position: PositionLevel
    department: string
  }
}
