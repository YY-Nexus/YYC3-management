"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Building, Users, Briefcase } from "lucide-react"

import { StructureTab } from "./components/structure-tab"
import { EmployeesTab } from "./components/employees-tab"
import { PositionsTab } from "./components/positions-tab"
import { ConfirmDeleteDialog } from "./components/confirm-delete-dialog"
import { EmployeeDialog } from "./components/employee-dialog"
import { DepartmentDialog } from "./components/department-dialog"
import { PositionDialog } from "./components/position-dialog"
import { useOrganizationData } from "./hooks/use-organization-data"

export default function OrganizationStructure() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("structure")
  const [error, setError] = useState<string | null>(null)

  const {
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
  } = useOrganizationData({ toast, setError })

  // 模拟加载数据
  useEffect(() => {
    // 初始化加载逻辑已移至 useOrganizationData hook
  }, [])

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">组织架构与权限管理</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="structure" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            <span>组织架构</span>
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>员工管理</span>
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>职位管理</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure">
          <StructureTab
            departments={departments}
            isLoading={isLoading}
            setNewDepartment={setNewDepartment}
            setIsEditing={setIsEditing}
            setEditingId={setEditingId}
            setShowDepartmentDialog={setShowDepartmentDialog}
            editDepartment={editDepartment}
            confirmDelete={confirmDelete}
          />
        </TabsContent>

        <TabsContent value="employees">
          <EmployeesTab
            employees={employees}
            isLoading={isLoading}
            setNewEmployee={setNewEmployee}
            setIsEditing={setIsEditing}
            setEditingId={setEditingId}
            setShowEmployeeDialog={setShowEmployeeDialog}
            editEmployee={editEmployee}
            confirmDelete={confirmDelete}
            toggleEmployeeStatus={toggleEmployeeStatus}
          />
        </TabsContent>

        <TabsContent value="positions">
          <PositionsTab
            positions={positions}
            isLoading={isLoading}
            setNewPosition={setNewPosition}
            setTempResponsibilities={setTempResponsibilities}
            setTempRequirements={setTempRequirements}
            setIsEditing={setIsEditing}
            setEditingId={setEditingId}
            setShowPositionDialog={setShowPositionDialog}
            editPosition={editPosition}
            confirmDelete={confirmDelete}
          />
        </TabsContent>
      </Tabs>

      {/* 对话框组件 */}
      <EmployeeDialog
        showEmployeeDialog={showEmployeeDialog}
        setShowEmployeeDialog={setShowEmployeeDialog}
        isEditing={isEditing}
        error={error}
        newEmployee={newEmployee}
        setNewEmployee={setNewEmployee}
        addEmployee={addEmployee}
        isLoading={isLoading}
        departments={departments}
        positions={positions}
      />

      <DepartmentDialog
        showDepartmentDialog={showDepartmentDialog}
        setShowDepartmentDialog={setShowDepartmentDialog}
        isEditing={isEditing}
        error={error}
        newDepartment={newDepartment}
        setNewDepartment={setNewDepartment}
        addDepartment={addDepartment}
        isLoading={isLoading}
        departments={departments}
        employees={employees}
      />

      <PositionDialog
        showPositionDialog={showPositionDialog}
        setShowPositionDialog={setShowPositionDialog}
        isEditing={isEditing}
        error={error}
        newPosition={newPosition}
        setNewPosition={setNewPosition}
        tempResponsibilities={tempResponsibilities}
        tempRequirements={tempRequirements}
        newResponsibility={newResponsibility}
        setNewResponsibility={setNewResponsibility}
        newRequirement={newRequirement}
        setNewRequirement={setNewRequirement}
        addResponsibility={addResponsibility}
        removeResponsibility={removeResponsibility}
        addRequirement={addRequirement}
        removeRequirement={removeRequirement}
        addPosition={addPosition}
        isLoading={isLoading}
        departments={departments}
      />

      <ConfirmDeleteDialog
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        itemToDelete={itemToDelete}
        handleDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
