import type React from "react"
import type { ReactNode } from "react"

interface TreeNodeProps {
  label: string
  children?: ReactNode
}

export const TreeNode: React.FC<TreeNodeProps> = ({ label, children }) => {
  return (
    <li>
      {label}
      {children && <ul>{children}</ul>}
    </li>
  )
}

interface TreeProps {
  children: ReactNode
}

export const Tree: React.FC<TreeProps> = ({ children }) => {
  return <ul>{children}</ul>
}
