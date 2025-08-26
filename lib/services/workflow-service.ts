import type {
  WorkflowTemplate,
  WorkflowInstance,
  WorkflowTask,
  NotificationRecord,
  PositionLevel,
  TaskStatus,
  NotificationType,
} from "../types/workflow-types"

// 模拟数据库中的工作流模板
const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "template-1",
    name: "经管工作日常操作流程",
    description: "经管工作日常操作时间表的工作流程",
    category: "日常运营",
    nodes: [
      {
        id: "node-1",
        title: "上班前准备",
        description: "员工上班前准备工作，包括着装整齐、仪容仪表检查等",
        category: "日常准备",
        responsibleLevel: "员工",
        timeLimit: 15,
        reminderBefore: 5,
        escalationAfter: 10,
        warningAfter: 20,
      },
      {
        id: "node-2",
        title: "营业前准备",
        description: "检查设备设施是否正常，环境卫生是否达标，物品是否齐全",
        category: "日常准备",
        responsibleLevel: "员工",
        timeLimit: 30,
        reminderBefore: 10,
        escalationAfter: 15,
        warningAfter: 30,
      },
      {
        id: "node-3",
        title: "早会",
        description: "召开早会，布置当日工作，强调工作重点和注意事项",
        category: "会议",
        responsibleLevel: "直属管理",
        timeLimit: 20,
        reminderBefore: 10,
        escalationAfter: 15,
        warningAfter: 25,
        dependsOn: ["node-2"],
      },
      {
        id: "node-4",
        title: "营业中巡查",
        description: "检查各区域运营情况，解决突发问题",
        category: "检查",
        responsibleLevel: "直属管理",
        timeLimit: 45,
        reminderBefore: 10,
        escalationAfter: 20,
        warningAfter: 30,
      },
      {
        id: "node-5",
        title: "中班交接",
        description: "与中班人员进行工作交接，沟通重要事项",
        category: "交接",
        responsibleLevel: "员工",
        timeLimit: 15,
        reminderBefore: 5,
        escalationAfter: 10,
        warningAfter: 15,
      },
      {
        id: "node-6",
        title: "日报填写",
        description: "填写当日运营数据报表",
        category: "报表",
        responsibleLevel: "直属管理",
        timeLimit: 30,
        reminderBefore: 15,
        escalationAfter: 30,
        warningAfter: 45,
      },
      {
        id: "node-7",
        title: "晚会",
        description: "总结当日工作，布置次日任务",
        category: "会议",
        responsibleLevel: "门店副总",
        timeLimit: 20,
        reminderBefore: 10,
        escalationAfter: 15,
        warningAfter: 25,
        dependsOn: ["node-6"],
      },
    ],
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "template-2",
    name: "月度盘点流程",
    description: "每月库存和设备盘点工作流程",
    category: "盘点管理",
    nodes: [
      {
        id: "node-1",
        title: "盘点准备",
        description: "准备盘点表格和工具，安排人员分工",
        category: "准备",
        responsibleLevel: "直属管理",
        timeLimit: 60,
        reminderBefore: 30,
        escalationAfter: 30,
        warningAfter: 60,
      },
      {
        id: "node-2",
        title: "库存盘点",
        description: "对所有库存进行清点和记录",
        category: "盘点",
        responsibleLevel: "员工",
        timeLimit: 180,
        reminderBefore: 30,
        escalationAfter: 60,
        warningAfter: 120,
        dependsOn: ["node-1"],
      },
      {
        id: "node-3",
        title: "设备盘点",
        description: "对所有设备进行检查和记录",
        category: "盘点",
        responsibleLevel: "员工",
        timeLimit: 120,
        reminderBefore: 30,
        escalationAfter: 60,
        warningAfter: 90,
        dependsOn: ["node-1"],
      },
      {
        id: "node-4",
        title: "盘点数据汇总",
        description: "汇总所有盘点数据，核对差异",
        category: "报表",
        responsibleLevel: "直属管理",
        timeLimit: 90,
        reminderBefore: 30,
        escalationAfter: 45,
        warningAfter: 60,
        dependsOn: ["node-2", "node-3"],
      },
      {
        id: "node-5",
        title: "盘点报告审核",
        description: "审核盘点报告，确认数据准确性",
        category: "审核",
        responsibleLevel: "门店副总",
        timeLimit: 60,
        reminderBefore: 20,
        escalationAfter: 30,
        warningAfter: 45,
        dependsOn: ["node-4"],
      },
      {
        id: "node-6",
        title: "盘点报告提交",
        description: "将最终盘点报告提交给总部",
        category: "报表",
        responsibleLevel: "总经理",
        timeLimit: 30,
        reminderBefore: 15,
        escalationAfter: 20,
        warningAfter: 25,
        dependsOn: ["node-5"],
      },
    ],
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2023-02-01T00:00:00Z",
  },
]

// 模拟数据库中的工作流实例
const workflowInstances: WorkflowInstance[] = []

// 模拟数据库中的通知记录
const notificationRecords: NotificationRecord[] = []

// 生成唯一ID
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

// 创建工作流实例
export async function createWorkflowInstance(
  templateId: string,
  name: string,
  description: string,
  startTime: string,
  createdBy: string,
): Promise<WorkflowInstance> {
  const template = workflowTemplates.find((t) => t.id === templateId)
  if (!template) {
    throw new Error(`Template with ID ${templateId} not found`)
  }

  const tasks: WorkflowTask[] = template.nodes.map((node) => {
    const scheduledTime = new Date(startTime)
    // 这里可以根据节点依赖关系计算实际的计划时间

    const reminderTime = new Date(scheduledTime)
    reminderTime.setMinutes(reminderTime.getMinutes() - node.reminderBefore)

    const escalationTime = new Date(scheduledTime)
    escalationTime.setMinutes(escalationTime.getMinutes() + node.escalationAfter)

    const warningTime = new Date(scheduledTime)
    warningTime.setMinutes(warningTime.getMinutes() + node.warningAfter)

    return {
      id: generateId("task"),
      nodeId: node.id,
      title: node.title,
      description: node.description,
      status: "pending",
      assignedTo: node.responsibleLevel,
      originalAssignee: node.responsibleLevel,
      scheduledTime: scheduledTime.toISOString(),
      reminderTime: reminderTime.toISOString(),
      escalationTime: escalationTime.toISOString(),
      warningTime: warningTime.toISOString(),
      category: node.category,
    }
  })

  const instance: WorkflowInstance = {
    id: generateId("instance"),
    templateId,
    name,
    description,
    status: "active",
    tasks,
    startTime,
    createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  workflowInstances.push(instance)
  return instance
}

// 获取工作流模板列表
export async function getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
  return workflowTemplates
}

// 获取工作流模板详情
export async function getWorkflowTemplate(id: string): Promise<WorkflowTemplate | null> {
  return workflowTemplates.find((t) => t.id === id) || null
}

// 获取工作流实例列表
export async function getWorkflowInstances(): Promise<WorkflowInstance[]> {
  return workflowInstances
}

// 获取工作流实例详情
export async function getWorkflowInstance(id: string): Promise<WorkflowInstance | null> {
  return workflowInstances.find((i) => i.id === id) || null
}

// 更新任务状态
export async function updateTaskStatus(
  instanceId: string,
  taskId: string,
  status: TaskStatus,
  notes?: string,
): Promise<WorkflowTask | null> {
  const instance = workflowInstances.find((i) => i.id === instanceId)
  if (!instance) {
    return null
  }

  const taskIndex = instance.tasks.findIndex((t) => t.id === taskId)
  if (taskIndex === -1) {
    return null
  }

  const task = instance.tasks[taskIndex]
  task.status = status

  if (status === "completed") {
    task.completionTime = new Date().toISOString()
  } else if (status === "in_progress" && !task.startTime) {
    task.startTime = new Date().toISOString()
  }

  if (notes) {
    task.notes = notes
  }

  instance.updatedAt = new Date().toISOString()
  return task
}

// 升级任务
export async function escalateTask(
  instanceId: string,
  taskId: string,
  newAssignee: PositionLevel,
): Promise<WorkflowTask | null> {
  const instance = workflowInstances.find((i) => i.id === instanceId)
  if (!instance) {
    return null
  }

  const taskIndex = instance.tasks.findIndex((t) => t.id === taskId)
  if (taskIndex === -1) {
    return null
  }

  const task = instance.tasks[taskIndex]
  task.assignedTo = newAssignee
  task.status = "escalated"

  instance.updatedAt = new Date().toISOString()

  // 创建升级通知
  createNotification({
    taskId,
    type: "escalation",
    message: `任务"${task.title}"已升级至${newAssignee}`,
    sentTo: newAssignee,
  })

  return task
}

// 创建通知
export async function createNotification({
  taskId,
  type,
  message,
  sentTo,
}: {
  taskId: string
  type: NotificationType
  message: string
  sentTo: PositionLevel
}): Promise<NotificationRecord> {
  const notification: NotificationRecord = {
    id: generateId("notification"),
    taskId,
    type,
    message,
    sentTo,
    sentTime: new Date().toISOString(),
    isRead: false,
  }

  notificationRecords.push(notification)
  return notification
}

// 获取用户通知
export async function getUserNotifications(position: PositionLevel): Promise<NotificationRecord[]> {
  return notificationRecords
    .filter((n) => n.sentTo === position)
    .sort((a, b) => new Date(b.sentTime).getTime() - new Date(a.sentTime).getTime())
}

// 标记通知为已读
export async function markNotificationAsRead(id: string): Promise<NotificationRecord | null> {
  const index = notificationRecords.findIndex((n) => n.id === id)
  if (index === -1) {
    return null
  }

  notificationRecords[index].isRead = true
  return notificationRecords[index]
}

// 检查并处理超时任务
export async function checkOverdueTasks(): Promise<void> {
  const now = new Date()

  for (const instance of workflowInstances) {
    if (instance.status !== "active") continue

    for (const task of instance.tasks) {
      if (task.status !== "pending" && task.status !== "in_progress" && task.status !== "escalated") continue

      const escalationTime = new Date(task.escalationTime)
      const warningTime = new Date(task.warningTime)

      // 检查是否需要升级
      if (now > escalationTime && task.assignedTo === task.originalAssignee) {
        // 确定升级到哪个级别
        let newAssignee: PositionLevel
        switch (task.assignedTo) {
          case "员工":
            newAssignee = "直属管理"
            break
          case "直属管理":
            newAssignee = "门店副总"
            break
          default:
            newAssignee = "总经理"
        }

        await escalateTask(instance.id, task.id, newAssignee)
      }

      // 检查是否需要发出警告
      if (now > warningTime && task.status !== "warning") {
        task.status = "warning"

        // 创建警告通知
        await createNotification({
          taskId: task.id,
          type: "warning",
          message: `紧急警告：任务"${task.title}"已严重超时，请立即处理！`,
          sentTo: "总经理", // 警告通知发送给最高级别
        })
      }
    }
  }
}

// 初始化示例数据
export async function initializeExampleData(): Promise<void> {
  // 如果没有实例，创建一个示例实例
  if (workflowInstances.length === 0) {
    const startTime = new Date()
    startTime.setHours(8, 0, 0, 0) // 设置为今天早上8点

    await createWorkflowInstance(
      "template-1",
      "今日经管工作流程",
      "今日的经管工作日常操作流程",
      startTime.toISOString(),
      "系统",
    )
  }
}
