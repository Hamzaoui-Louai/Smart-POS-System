"use client"

import { useState } from "react"
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "./Button"
import { Card, CardContent } from "./Card"
import { cn } from "@/utils/cn"

export function CrudCard({ children, onEdit, onDelete, collapsible = false, className, ...props }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className={cn("border-0 shadow-lg hover:shadow-xl transition-shadow", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">{children.preview}</div>
          <div className="flex items-center gap-2 ml-4">
            {collapsible && children.details && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {collapsible && children.details && isExpanded && children.details}
      </CardContent>
    </Card>
  )
}
