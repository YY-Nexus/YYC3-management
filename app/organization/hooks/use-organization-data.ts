"use client"

import { useState, useEffect } from "react"
import type { Employee, Department, Position, ItemToDelete } from "../types"

type UseOrganizationDataProps = {
  toast: any
  setError: (error: string | null) => void
}

export function useOrganizationData({ toast, setError }: UseOrganizationDataProps) {
  const [isLoading, setIsLoading] = useState(false)

  // 员工数据
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "张三",
      role: "总经理",
      department: "管理层",
      email: "zhangsan@example.com",
      phone: "13800138001",
      joinDate: "2020-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "李四",
      role: "销售主管",
      department: "销售部",
      email: "lisi@example.com",
      phone: "13800138002",
      joinDate: "2020-03-10",
      status: "active",
    },
    {
      id: "3",
      name: "王五",
      role: "技术主管",
      department: "技术部",
      email: "wangwu@example.com",
      phone: "13800138003",
      joinDate: "2020-02-20",
      status: "active",
    },
    {
      id: "4",
      name: "赵六",
      role: "市场专员",
      department: "市场部",
      email: "zhaoliu@example.com",
      phone: "13800138004",
      joinDate: "2021-05-15",
      status: "onLeave",
    },
    {
      id: "5",
      name: "钱七",
      role: "人事主管",
      department: "人事部",
      email: "qianqi@example.com",
      phone: "13800138005",
      joinDate: "2020-06-18",
      status: "active",
    },
  ])

  // 部门数据
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "公司",
      children: [
        {
          id: "2",
          name: "管理层",
          manager: "张三",
          parentId: "1",
        },
        {
          id: "3",
          name: "销售部",
          manager: "李四",
          parentId: "1",
          children: [
            { id: "7", name: "国内销售组", parentId: "3" },
            { id: "8", name: "国际销售组", parentId: "3" },
          ],
        },
        {
          id: "4",
          name: "技术部",
          manager: "王五",
          parentId: "1",
          children: [
            { id: "9", name: "前端开发组", parentId: "4" },
            { id: "10", name: "后端开发组", parentId: "4" },
            { id: "11", name: "测试组", parentId: "4" },
          ],
        },
        {
          id: "5",
          name: "市场部",
          parentId: "1",
        },
        {
          id: "6",
          name: "人事部",
          manager: "钱七",
          parentId: "1",
        },
      ],
    },
  ])

  // 职位数据
  const [positions, setPositions] = useState<Position[]>([
    {
      id: "1",
      title: "总经理",
      department: "管理层",
      level: "高级",
      responsibilities: ["负责公司整体运营", "制定公司战略", "管理各部门负责人"],
      requirements: ["10年以上管理经验", "MBA或相关学位", "优秀的领导能力"],
    },
    {
      id: "2",
      title: "销售主管",
      department: "销售部",
      level: "中级",
      responsibilities: ["管理销售团队", "制定销售策略", "达成销售目标"],
      requirements: ["5年以上销售经验", "优秀的沟通能力", "团队管理经验"],
    },
    {
      id: "3",
      title: "技术主管",
      department: "技术部",
      level: "中级",
      responsibilities: ["管理技术团队", "制定技术方案", "保证项目质量"],
      requirements: ["5年以上技术经验", "精通相关技术栈", "项目管理经验"],
    },
    {
      id: "4",
      title: "市场专员",
      department: "市场部",
      level: "初级",
      responsibilities: ["执行市场活动", "分析市场数据", "撰写市场报告"],
      requirements: ["市场营销相关学位", "良好的数据分析能力", "优秀的写作能力"],
    },
    {
      id: "5",
      title: "人事主管",
      department: "人事部",
      level: "中级",
      responsibilities: ["管理招聘流程", "员工培训与发展", "绩效管理"],
      requirements: ["人力资源管理相关经验", "熟悉劳动法规", "优秀的人际交往能力"],
    },
  ])

  // 表单状态
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id" | "status">>({
    name: "",
    role: "",
    department: "",
    email: "",
    phone: "",
    joinDate: "",
  })

  const [newDepartment, setNewDepartment] = useState<Omit<Department, "id" | "children">>({
    name: "",
    manager: "",
    parentId: "1",
  })

  const [newPosition, setNewPosition] = useState<Omit<Position, "id" | "responsibilities" | "requirements">>({
    title: "",
    department: "",
    level: "",
  })
  const [newResponsibility, setNewResponsibility] = useState("")
  const [newRequirement, setNewRequirement] = useState("")
  const [tempResponsibilities, setTempResponsibilities] = useState<string[]>([])
  const [tempRequirements, setTempRequirements] = useState<string[]>([])

  // 对话框状态
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false)
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false)
  const [showPositionDialog, setShowPositionDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete>(null)

  // 模拟加载数据
  useEffect(() => {
    setIsLoading(true)
    // 模拟API请求延迟
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // 添加员工
  const addEmployee = () => {
    setError(null)

    // 表单验证
    if (!newEmployee.name.trim()) {
      setError("请输入员工姓名")
      return
    }

    if (!newEmployee.role) {
      setError("请选择员工角色")
      return
    }

    if (!newEmployee.department) {
      setError("请选择所属部门")
      return
    }

    if (!newEmployee.email) {
      setError("请输入电子邮箱")
      return
    }

    // 电子邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmployee.email)) {
      setError("请输入有效的电子邮箱")
      return
    }

    setIsLoading(true)

    // 模拟API请求延迟
    setTimeout(() => {
      if (isEditing && editingId) {
        // 更新员工
        setEmployees(
          employees.map((emp) => (emp.id === editingId ? { ...newEmployee, id: editingId, status: emp.status } : emp)),
        )
        toast({
          title: "更新成功",
          description: `员工 ${newEmployee.name} 的信息已更新`,
        })
      } else {
        // 添加新员工
        const newId = String(employees.length + 1)
        setEmployees([...employees, { ...newEmployee, id: newId, status: "active" }])
        toast({
          title: "添加成功",
          description: `员工 ${newEmployee.name} 已添加到系统`,
        })
      }

      // 重置表单
      setNewEmployee({
        name: "",
        role: "",
        department: "",
        email: "",
        phone: "",
        joinDate: "",
      })
      setShowEmployeeDialog(false)
      setIsEditing(false)
      setEditingId(null)
      setIsLoading(false)
    }, 800)
  }

  // 添加部门
  const addDepartment = () => {
    setError(null)

    // 表单验证
    if (!newDepartment.name.trim()) {
      setError("请输入部门名称")
      return
    }

    if (!newDepartment.parentId) {
      setError("请选择上级部门")
      return
    }

    setIsLoading(true)

    // 模拟API请求延迟
    setTimeout(() => {
      if (isEditing && editingId) {
        // 更新部门（简化版，实际应用中需要递归更新部门树）
        const updateDepartmentTree = (depts: Department[]): Department[] => {
          return depts.map((dept) => {
            if (dept.id === editingId) {
              return {
                ...dept,
                name: newDepartment.name,
                manager: newDepartment.manager,
                parentId: newDepartment.parentId,
              }
            }
            if (dept.children) {
              return { ...dept, children: updateDepartmentTree(dept.children) }
            }
            return dept
          })
        }

        setDepartments(updateDepartmentTree(departments))
        toast({
          title: "更新成功",
          description: `部门 ${newDepartment.name} 的信息已更新`,
        })
      } else {
        // 添加新部门（简化版，实际应用中需要递归添加到正确的父部门下）
        const newId = String(Math.max(...getAllDepartmentIds()) + 1)
        const newDept: Department = {
          id: newId,
          name: newDepartment.name,
          manager: newDepartment.manager,
          parentId: newDepartment.parentId,
        }

        // 找到父部门并添加子部门
        const addToDepartmentTree = (depts: Department[]): Department[] => {
          return depts.map((dept) => {
            if (dept.id === newDepartment.parentId) {
              return {
                ...dept,
                children: dept.children ? [...dept.children, newDept] : [newDept],
              }
            }
            if (dept.children) {
              return { ...dept, children: addToDepartmentTree(dept.children) }
            }
            return dept
          })
        }

        setDepartments(addToDepartmentTree(departments))
        toast({
          title: "添加成功",
          description: `部门 ${newDepartment.name} 已添加到系统`,
        })
      }

      // 重置表单
      setNewDepartment({
        name: "",
        manager: "",
        parentId: "1",
      })
      setShowDepartmentDialog(false)
      setIsEditing(false)
      setEditingId(null)
      setIsLoading(false)
    }, 800)
  }

  // 添加职位
  const addPosition = () => {
    setError(null)

    // 表单验证
    if (!newPosition.title.trim()) {
      setError("请输入职位名称")
      return
    }

    if (!newPosition.department) {
      setError("请选择所属部门")
      return
    }

    if (!newPosition.level) {
      setError("请选择职级")
      return
    }

    if (tempResponsibilities.length === 0) {
      setError("请至少添加一项职责")
      return
    }

    if (tempRequirements.length === 0) {
      setError("请至少添加一项要求")
      return
    }

    setIsLoading(true)

    // 模拟API请求延迟
    setTimeout(() => {
      if (isEditing && editingId) {
        // 更新职位
        setPositions(
          positions.map((pos) =>
            pos.id === editingId
              ? {
                  ...pos,
                  title: newPosition.title,
                  department: newPosition.department,
                  level: newPosition.level,
                  responsibilities: tempResponsibilities,
                  requirements: tempRequirements,
                }
              : pos,
          ),
        )
        toast({
          title: "更新成功",
          description: `职位 ${newPosition.title} 的信息已更新`,
        })
      } else {
        // 添加新职位
        const newId = String(positions.length + 1)
        setPositions([
          ...positions,
          {
            id: newId,
            title: newPosition.title,
            department: newPosition.department,
            level: newPosition.level,
            responsibilities: tempResponsibilities,
            requirements: tempRequirements,
          },
        ])
        toast({
          title: "添加成功",
          description: `职位 ${newPosition.title} 已添加到系统`,
        })
      }

      // 重置表单
      setNewPosition({
        title: "",
        department: "",
        level: "",
      })
      setTempResponsibilities([])
      setTempRequirements([])
      setNewResponsibility("")
      setNewRequirement("")
      setShowPositionDialog(false)
      setIsEditing(false)
      setEditingId(null)
      setIsLoading(false)
    }, 800)
  }

  // 编辑员工
  const editEmployee = (id: string) => {
    const employeeToEdit = employees.find((emp) => emp.id === id)
    if (employeeToEdit) {
      setNewEmployee({
        name: employeeToEdit.name,
        role: employeeToEdit.role,
        department: employeeToEdit.department,
        email: employeeToEdit.email,
        phone: employeeToEdit.phone,
        joinDate: employeeToEdit.joinDate,
      })
      setIsEditing(true)
      setEditingId(id)
      setShowEmployeeDialog(true)
    }
  }

  // 编辑部门
  const editDepartment = (id: string) => {
    const findDepartment = (depts: Department[]): Department | undefined => {
      for (const dept of depts) {
        if (dept.id === id) {
          return dept
        }
        if (dept.children) {
          const found = findDepartment(dept.children)
          if (found) return found
        }
      }
      return undefined
    }

    const departmentToEdit = findDepartment(departments)
    if (departmentToEdit) {
      setNewDepartment({
        name: departmentToEdit.name,
        manager: departmentToEdit.manager || "",
        parentId: departmentToEdit.parentId || "1",
      })
      setIsEditing(true)
      setEditingId(id)
      setShowDepartmentDialog(true)
    }
  }

  // 编辑职位
  const editPosition = (id: string) => {
    const positionToEdit = positions.find((pos) => pos.id === id)
    if (positionToEdit) {
      setNewPosition({
        title: positionToEdit.title,
        department: positionToEdit.department,
        level: positionToEdit.level,
      })
      setTempResponsibilities(positionToEdit.responsibilities)
      setTempRequirements(positionToEdit.requirements)
      setIsEditing(true)
      setEditingId(id)
      setShowPositionDialog(true)
    }
  }

  // 确认删除
  const confirmDelete = (id: string, type: "employee" | "department" | "position") => {
    setItemToDelete({ id, type })
    setShowDeleteConfirm(true)
  }

  // 执行删除
  const handleDelete = () => {
    if (!itemToDelete) return

    setIsLoading(true)

    // 模拟API请求延迟
    setTimeout(() => {
      switch (itemToDelete.type) {
        case "employee":
          setEmployees(employees.filter((emp) => emp.id !== itemToDelete.id))
          toast({
            title: "删除成功",
            description: "员工已从系统中删除",
          })
          break

        case "department":
          // 简化版删除部门，实际应用中需要递归删除
          const removeDepartment = (depts: Department[]): Department[] => {
            return depts.filter((dept) => {
              if (dept.id === itemToDelete.id) return false
              if (dept.children) {
                dept.children = removeDepartment(dept.children)
              }
              return true
            })
          }

          setDepartments(removeDepartment(departments))
          toast({
            title: "删除成功",
            description: "部门已从系统中删除",
          })
          break

        case "position":
          setPositions(positions.filter((pos) => pos.id !== itemToDelete.id))
          toast({
            title: "删除成功",
            description: "职位已从系统中删除",
          })
          break
      }

      setShowDeleteConfirm(false)
      setItemToDelete(null)
      setIsLoading(false)
    }, 800)
  }

  // 获取所有部门ID
  const getAllDepartmentIds = (): number[] => {
    const ids: number[] = []

    const collectIds = (depts: Department[]) => {
      depts.forEach((dept) => {
        ids.push(Number(dept.id))
        if (dept.children) {
          collectIds(dept.children)
        }
      })
    }

    collectIds(departments)
    return ids
  }

  // 获取所有部门的扁平列表（用于下拉选择）
  const getAllDepartments = (): { id: string; name: string }[] => {
    const flatDepartments: { id: string; name: string }[] = []

    const collectDepts = (depts: Department[], prefix = "") => {
      depts.forEach((dept) => {
        flatDepartments.push({
          id: dept.id,
          name: prefix + dept.name,
        })
        if (dept.children) {
          collectDepts(dept.children, prefix + dept.name + " > ")
        }
      })
    }

    collectDepts(departments)
    return flatDepartments
  }

  // 添加职责
  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setTempResponsibilities([...tempResponsibilities, newResponsibility.trim()])
      setNewResponsibility("")
    }
  }

  // 删除职责
  const removeResponsibility = (index: number) => {
    setTempResponsibilities(tempResponsibilities.filter((_, i) => i !== index))
  }

  // 添加要求
  const addRequirement = () => {
    if (newRequirement.trim()) {
      setTempRequirements([...tempRequirements, newRequirement.trim()])
      setNewRequirement("")
    }
  }

  // 删除要求
  const removeRequirement = (index: number) => {
    setTempRequirements(tempRequirements.filter((_, i) => i !== index))
  }

  // 切换员工状态
  const toggleEmployeeStatus = (id: string) => {
    setEmployees(
      employees.map((emp) => {
        if (emp.id === id) {
          const newStatus = emp.status === "active" ? "inactive" : "active"
          return { ...emp, status: newStatus }
        }
        return emp
      }),
    )

    const employee = employees.find((emp) => emp.id === id)
    if (employee) {
      toast({
        title: "状态已更新",
        description: `员工 ${employee.name} 的状态已更改为 ${employee.status === "active" ? "非活跃" : "活跃"}`,
      })
    }
  }

  return {
    employees,
    departments,
    positions,
    isLoading,
    newEmployee,
    setNewEmployee,
    newDepartment,
    setNewDepartment,
    newPosition,
    setNewPosition,
    tempResponsibilities,
    setTempResponsibilities,
    tempRequirements,
    setTempRequirements,
    newResponsibility,
    setNewResponsibility,
    newRequirement,
    setNewRequirement,
    showEmployeeDialog,
    setShowEmployeeDialog,
    showDepartmentDialog,
    setShowDepartmentDialog,
    showPositionDialog,
    setShowPositionDialog,
    isEditing,
    setIsEditing,
    editingId,
    setEditingId,
    showDeleteConfirm,
    setShowDeleteConfirm,
    itemToDelete,
    setItemToDelete,
    addEmployee,
    addDepartment,
    addPosition,
    editEmployee,
    editDepartment,
    editPosition,
    confirmDelete,
    handleDelete,
    toggleEmployeeStatus,
    addResponsibility,
    removeResponsibility,
    addRequirement,
    removeRequirement,
    getAllDepartments,
  }
}
