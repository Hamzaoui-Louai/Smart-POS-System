"use client"

import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CrudListHeaderProps {
  title: string
  searchValue: string
  onSearchChange: (value: string) => void
  onAddClick: () => void
  addButtonText?: string
  showAddButton?: boolean
}

export function CrudListHeader({
  title,
  searchValue,
  onSearchChange,
  onAddClick,
  addButtonText = "Add New",
  showAddButton = true,
}: CrudListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 className="font-heading text-3xl font-bold text-gray-900 tracking-wide">{title}</h1>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>

        {showAddButton && (
          <Button onClick={onAddClick} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            {addButtonText}
          </Button>
        )}
      </div>
    </div>
  )
}
