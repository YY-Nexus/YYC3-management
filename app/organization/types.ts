export interface Department {
  id: string
  name: string
  parentId: string | null
  level: number
  managerId: string | null
  description: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Employee {
  id: string
  name: string
  position: string
  departmentId: string
  email: string
  phone: string
  status: "active" | "inactive"
  hireDate: string
  createdAt: string
  updatedAt: string
}

export interface Position {
  id: string
  name: string
  departmentId: string
  salaryRange: string
  status: "active" | "inactive"
  responsibilities: string[]
  requirements: string[]
  createdAt: string
  updatedAt: string
}

export interface ItemToDelete {
  id: string
  name: string
  type: "department" | "employee" | "position"
}

export interface NewEmployee {
  name: string
  position: string
  departmentId: string
  email: string
  phone: string
  status: "active" | "inactive"
  hireDate: string
}

export interface NewDepartment {
  name: string
  parentId: string | null
  managerId: string | null
  description: string
  status: "active" | "inactive"
}

export interface NewPosition {
  name: string
  departmentId: string
  salaryRange: string
  status: "active" | "inactive"
  responsibilities: string[]
  requirements: string[]
}
