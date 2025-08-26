"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export function DocumentSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 实际搜索逻辑
    console.log("搜索:", searchTerm)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setIsExpanded(false)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex items-center">
        <div
          className={`flex items-center border rounded-md overflow-hidden transition-all ${isExpanded ? "w-64" : "w-9"}`}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Input
            type="text"
            placeholder="搜索文档..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${isExpanded ? "w-full opacity-100" : "w-0 p-0 opacity-0"}`}
          />
          {searchTerm && isExpanded && (
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={clearSearch}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
