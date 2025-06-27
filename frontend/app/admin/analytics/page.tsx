"use client"

import { useState } from "react"
import { Calendar, Users, UserPlus, UserMinus, Edit, Filter, Download, Search, Activity } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminAnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("all")

  const adminLogs = [
    {
      id: "AL001",
      timestamp: "2024-01-15 14:30:22",
      action: "User Created",
      actionType: "create",
      details: "Created new supplier account for MedSupply Co.",
      affectedUser: "supplier@medsupply.com",
      affectedUserRole: "supplier",
    },
    {
      id: "AL002",
      timestamp: "2024-01-15 13:45:10",
      action: "User Updated",
      actionType: "update",
      details: "Updated pharmacy owner permissions for HealthPlus",
      affectedUser: "owner@healthplus.com",
      affectedUserRole: "pharmacy_owner",
    },
    {
      id: "AL003",
      timestamp: "2024-01-15 12:20:05",
      action: "User Deleted",
      actionType: "delete",
      details: "Removed inactive cashier account",
      affectedUser: "cashier@oldpharmacy.com",
      affectedUserRole: "cashier",
    },
    {
      id: "AL004",
      timestamp: "2024-01-14 16:15:33",
      action: "Role Changed",
      actionType: "update",
      details: "Changed user role from cashier to logistics coordinator",
      affectedUser: "coordinator@logistics.com",
      affectedUserRole: "logistics",
    },
    {
      id: "AL005",
      timestamp: "2024-01-14 11:30:18",
      action: "User Created",
      actionType: "create",
      details: "Created new pharmacy owner account for WellCare Pharmacy",
      affectedUser: "owner@wellcare.com",
      affectedUserRole: "pharmacy_owner",
    },
  ]

  const userStats = {
    total: 1247,
    byRole: {
      client: 856,
      pharmacy_owner: 45,
      supplier: 23,
      logistics: 18,
      cashier: 89,
      admin: 3,
    },
    recentActivity: {
      newUsersThisWeek: 12,
      activeUsersToday: 234,
      deletedUsersThisMonth: 3,
    },
  }

  const filteredLogs = adminLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.affectedUser.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterPeriod === "all") return matchesSearch

    const logDate = new Date(log.timestamp)
    const now = new Date()

    if (filterPeriod === "today") {
      return matchesSearch && logDate.toDateString() === now.toDateString()
    }

    if (filterPeriod === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(now.getDate() - 7)
      return matchesSearch && logDate >= weekAgo
    }

    return matchesSearch
  })

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "create":
        return <UserPlus className="w-4 h-4 text-green-600" />
      case "update":
        return <Edit className="w-4 h-4 text-blue-600" />
      case "delete":
        return <UserMinus className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getActionBadge = (actionType: string) => {
    switch (actionType) {
      case "create":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Created
          </Badge>
        )
      case "update":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Updated
          </Badge>
        )
      case "delete":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Deleted
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Action
          </Badge>
        )
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="animate-fade-in">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">Analytics & Logs</h1>
          <p className="text-gray-600">Monitor system activity and user management statistics</p>
        </div>

        {/* User Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{userStats.total}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New This Week</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{userStats.recentActivity.newUsersThisWeek}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Today</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{userStats.recentActivity.activeUsersToday}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Admin Actions</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{adminLogs.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Edit className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Distribution by Role */}
        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="font-heading text-xl">User Distribution by Role</CardTitle>
            <p className="text-sm text-gray-600">Current breakdown of users across different roles</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(userStats.byRole).map(([role, count]) => (
                <div key={role} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-2xl font-bold text-gray-900">{count}</h4>
                  <p className="text-sm text-gray-600 capitalize">{role.replace("_", " ")}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Activity Logs */}
        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-heading text-xl">Admin Activity Logs</CardTitle>
              <p className="text-sm text-gray-600">Complete record of administrative actions performed</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Filter by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors ${
                      index !== filteredLogs.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">{getActionIcon(log.actionType)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{log.action}</h4>
                        {getActionBadge(log.actionType)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {log.affectedUser}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {log.affectedUserRole.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No activity logs found matching your search criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
