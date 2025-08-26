// 审批模板数据结构
export interface ApprovalTemplateField {
  id: string
  label: string
  type: "text" | "textarea" | "number" | "select" | "date" | "checkbox" | "file"
  placeholder?: string
  required?: boolean
  options?: string[] // 用于select类型
  defaultValue?: any
  description?: string
}

export interface ApprovalTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: string
  fields: ApprovalTemplateField[]
  approvers: string[] // 默认审批人
  priority?: "low" | "medium" | "high" | "urgent"
  estimatedDuration?: number // 预计审批时长(小时)
  popular?: boolean // 是否热门模板
}

// 预设的审批模板
export const approvalTemplates: ApprovalTemplate[] = [
  {
    id: "leave-request",
    name: "请假申请",
    description: "用于员工请假的标准流程",
    icon: "calendar",
    category: "人事",
    popular: true,
    estimatedDuration: 24,
    fields: [
      {
        id: "leave_type",
        label: "请假类型",
        type: "select",
        required: true,
        options: ["年假", "病假", "事假", "婚假", "产假", "丧假", "其他"],
      },
      {
        id: "start_date",
        label: "开始日期",
        type: "date",
        required: true,
      },
      {
        id: "end_date",
        label: "结束日期",
        type: "date",
        required: true,
      },
      {
        id: "days",
        label: "请假天数",
        type: "number",
        required: true,
      },
      {
        id: "reason",
        label: "请假原因",
        type: "textarea",
        required: true,
        placeholder: "请详细说明请假原因...",
      },
      {
        id: "contact",
        label: "紧急联系方式",
        type: "text",
        required: false,
      },
      {
        id: "handover",
        label: "工作交接人",
        type: "text",
        required: true,
      },
      {
        id: "attachments",
        label: "附件",
        type: "file",
        required: false,
        description: "如病假请上传医院证明",
      },
    ],
    approvers: ["直属主管", "部门经理"],
  },
  {
    id: "expense-claim",
    name: "费用报销",
    description: "用于报销各类业务费用",
    icon: "credit-card",
    category: "财务",
    popular: true,
    estimatedDuration: 48,
    fields: [
      {
        id: "expense_type",
        label: "费用类型",
        type: "select",
        required: true,
        options: ["差旅费", "办公用品", "招待费", "培训费", "交通费", "其他"],
      },
      {
        id: "amount",
        label: "报销金额",
        type: "number",
        required: true,
      },
      {
        id: "expense_date",
        label: "费用发生日期",
        type: "date",
        required: true,
      },
      {
        id: "project",
        label: "所属项目",
        type: "text",
        required: false,
      },
      {
        id: "description",
        label: "费用说明",
        type: "textarea",
        required: true,
        placeholder: "请详细说明费用用途...",
      },
      {
        id: "receipt",
        label: "是否有发票",
        type: "checkbox",
        required: false,
        defaultValue: true,
      },
      {
        id: "account",
        label: "收款账户",
        type: "text",
        required: true,
      },
      {
        id: "attachments",
        label: "附件",
        type: "file",
        required: true,
        description: "请上传发票或收据扫描件",
      },
    ],
    approvers: ["财务主管", "财务经理"],
  },
  {
    id: "purchase-request",
    name: "采购申请",
    description: "用于申请采购物品或服务",
    icon: "shopping-cart",
    category: "行政",
    estimatedDuration: 72,
    fields: [
      {
        id: "item_name",
        label: "物品名称",
        type: "text",
        required: true,
      },
      {
        id: "category",
        label: "物品类别",
        type: "select",
        required: true,
        options: ["办公用品", "电子设备", "软件", "家具", "其他"],
      },
      {
        id: "quantity",
        label: "数量",
        type: "number",
        required: true,
      },
      {
        id: "unit_price",
        label: "单价",
        type: "number",
        required: true,
      },
      {
        id: "total_price",
        label: "总价",
        type: "number",
        required: true,
      },
      {
        id: "supplier",
        label: "供应商",
        type: "text",
        required: false,
      },
      {
        id: "purpose",
        label: "用途说明",
        type: "textarea",
        required: true,
        placeholder: "请说明采购用途...",
      },
      {
        id: "urgent",
        label: "是否紧急",
        type: "checkbox",
        required: false,
      },
    ],
    approvers: ["部门经理", "采购主管", "财务主管"],
  },
  {
    id: "contract-review",
    name: "合同审批",
    description: "用于各类合同的审核和批准",
    icon: "file-text",
    category: "法务",
    estimatedDuration: 120,
    fields: [
      {
        id: "contract_name",
        label: "合同名称",
        type: "text",
        required: true,
      },
      {
        id: "contract_type",
        label: "合同类型",
        type: "select",
        required: true,
        options: ["销售合同", "采购合同", "服务合同", "劳务合同", "其他"],
      },
      {
        id: "party",
        label: "合同对方",
        type: "text",
        required: true,
      },
      {
        id: "amount",
        label: "合同金额",
        type: "number",
        required: true,
      },
      {
        id: "start_date",
        label: "开始日期",
        type: "date",
        required: true,
      },
      {
        id: "end_date",
        label: "结束日期",
        type: "date",
        required: true,
      },
      {
        id: "content",
        label: "主要内容",
        type: "textarea",
        required: true,
      },
      {
        id: "risk",
        label: "风险评估",
        type: "textarea",
        required: true,
      },
      {
        id: "attachments",
        label: "合同文件",
        type: "file",
        required: true,
        description: "请上传合同电子版",
      },
    ],
    approvers: ["法务专员", "法务经理", "分管副总", "总经理"],
  },
  {
    id: "overtime-request",
    name: "加班申请",
    description: "用于申请加班及相关补偿",
    icon: "clock",
    category: "人事",
    estimatedDuration: 24,
    fields: [
      {
        id: "overtime_date",
        label: "加班日期",
        type: "date",
        required: true,
      },
      {
        id: "start_time",
        label: "开始时间",
        type: "text",
        required: true,
        placeholder: "如: 18:00",
      },
      {
        id: "end_time",
        label: "结束时间",
        type: "text",
        required: true,
        placeholder: "如: 21:00",
      },
      {
        id: "hours",
        label: "加班小时数",
        type: "number",
        required: true,
      },
      {
        id: "reason",
        label: "加班原因",
        type: "textarea",
        required: true,
      },
      {
        id: "compensation",
        label: "补偿方式",
        type: "select",
        required: true,
        options: ["调休", "加班费", "其他"],
      },
    ],
    approvers: ["直属主管", "部门经理"],
  },
  {
    id: "training-request",
    name: "培训申请",
    description: "用于申请参加培训课程",
    icon: "graduation-cap",
    category: "人事",
    estimatedDuration: 72,
    fields: [
      {
        id: "training_name",
        label: "培训名称",
        type: "text",
        required: true,
      },
      {
        id: "organizer",
        label: "培训机构",
        type: "text",
        required: true,
      },
      {
        id: "start_date",
        label: "开始日期",
        type: "date",
        required: true,
      },
      {
        id: "end_date",
        label: "结束日期",
        type: "date",
        required: true,
      },
      {
        id: "location",
        label: "培训地点",
        type: "text",
        required: true,
      },
      {
        id: "cost",
        label: "培训费用",
        type: "number",
        required: true,
      },
      {
        id: "purpose",
        label: "培训目的",
        type: "textarea",
        required: true,
      },
      {
        id: "benefit",
        label: "预期收益",
        type: "textarea",
        required: true,
      },
      {
        id: "attachments",
        label: "培训资料",
        type: "file",
        required: false,
        description: "请上传培训课程介绍等资料",
      },
    ],
    approvers: ["直属主管", "部门经理", "人力资源经理"],
  },
  {
    id: "business-trip",
    name: "出差申请",
    description: "用于申请商务出差",
    icon: "plane",
    category: "行政",
    popular: true,
    estimatedDuration: 48,
    fields: [
      {
        id: "destination",
        label: "目的地",
        type: "text",
        required: true,
      },
      {
        id: "start_date",
        label: "开始日期",
        type: "date",
        required: true,
      },
      {
        id: "end_date",
        label: "结束日期",
        type: "date",
        required: true,
      },
      {
        id: "purpose",
        label: "出差目的",
        type: "textarea",
        required: true,
      },
      {
        id: "budget",
        label: "预算金额",
        type: "number",
        required: true,
      },
      {
        id: "transportation",
        label: "交通方式",
        type: "select",
        required: true,
        options: ["飞机", "高铁", "火车", "汽车", "其他"],
      },
      {
        id: "accommodation",
        label: "住宿安排",
        type: "textarea",
        required: false,
      },
      {
        id: "advance_payment",
        label: "是否需要预支款",
        type: "checkbox",
        required: false,
      },
    ],
    approvers: ["直属主管", "部门经理", "财务主管"],
  },
  {
    id: "it-service",
    name: "IT服务申请",
    description: "用于申请IT设备或服务支持",
    icon: "laptop",
    category: "IT",
    estimatedDuration: 48,
    fields: [
      {
        id: "service_type",
        label: "服务类型",
        type: "select",
        required: true,
        options: ["设备维修", "软件安装", "账号申请", "权限申请", "其他"],
      },
      {
        id: "description",
        label: "问题描述",
        type: "textarea",
        required: true,
        placeholder: "请详细描述您的问题或需求...",
      },
      {
        id: "urgency",
        label: "紧急程度",
        type: "select",
        required: true,
        options: ["低", "中", "高", "紧急"],
      },
      {
        id: "expected_time",
        label: "期望完成时间",
        type: "date",
        required: false,
      },
      {
        id: "attachments",
        label: "相关截图",
        type: "file",
        required: false,
        description: "如有问题截图请上传",
      },
    ],
    approvers: ["IT支持主管"],
  },
]

// 获取所有模板分类
export function getTemplateCategories(): string[] {
  const categories = new Set<string>()
  approvalTemplates.forEach((template) => {
    categories.add(template.category)
  })
  return Array.from(categories)
}

// 根据ID获取模板
export function getTemplateById(id: string): ApprovalTemplate | undefined {
  return approvalTemplates.find((template) => template.id === id)
}

// 根据分类获取模板
export function getTemplatesByCategory(category: string): ApprovalTemplate[] {
  return approvalTemplates.filter((template) => template.category === category)
}

// 获取热门模板
export function getPopularTemplates(): ApprovalTemplate[] {
  return approvalTemplates.filter((template) => template.popular)
}
