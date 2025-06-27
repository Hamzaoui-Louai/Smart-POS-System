"use client"

import type React from "react"

import { useState } from "react"
import { User, LogOut, Bell, ChevronDown, BarChart3, ShoppingCart } from "lucide-react"
import { PharmasphereLogoText } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface CashierLayoutProps {
  children: React.ReactNode
}

export function CashierLayout({ children }: CashierLayoutProps) {
  const [user] = useState({
    name: "Emily Davis",
    email: "emily@healthplus.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "cashier",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <PharmasphereLogoText />

            <div className="flex items-center gap-4">
              {/* Cashier Badge */}
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">Cashier</Badge>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  2
                </Badge>
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-blue-50">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block font-medium">{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Personal Information
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics & Logs
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Point of Sale
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
