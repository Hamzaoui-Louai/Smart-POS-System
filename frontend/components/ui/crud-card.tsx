"use client"

import type React from "react"

import { useState } from "react"
import { Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CrudCardProps {
  children: React.ReactNode
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  className?: string
}

export function CrudCard({
  children,
  onEdit,
  onDelete,
  showActions = true,
  collapsible = false,
  defaultExpanded = false,
  className = "",
}: CrudCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete?.()
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  return (
    <Card className={`card-shadow animate-fade-in ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {collapsible ? (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-left w-full hover:text-blue-600 transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <div className="flex-1">
                  {typeof children === "object" && "preview" in (children as any)
                    ? (children as any).preview
                    : children}
                </div>
              </button>
            ) : (
              children
            )}
          </div>

          {showActions && (
            <div className="flex items-center gap-2 ml-4">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className={`transition-colors ${
                    showDeleteConfirm
                      ? "text-red-600 bg-red-50 hover:bg-red-100"
                      : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  {showDeleteConfirm && <span className="ml-1 text-xs">Confirm?</span>}
                </Button>
              )}
            </div>
          )}
        </div>

        {collapsible && isExpanded && (
          <div className="mt-4 animate-slide-up">
            {typeof children === "object" && "details" in (children as any) ? (children as any).details : children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
