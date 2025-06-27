"use client"

import { Search, Plus } from "lucide-react"
import { Button } from "./Button"
import { Input } from "./Input"

export function CrudListHeader({ title, searchValue, onSearchChange, onAddClick, addButtonText }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="font-heading text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">Manage and organize your {title.toLowerCase()}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
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
        <Button onClick={onAddClick} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {addButtonText}
        </Button>
      </div>
    </div>
  )
}
