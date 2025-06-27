"use client"

import { useState } from "react"
import { Mail, Phone, Calendar, MapPin } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { CrudListHeader } from "@/components/ui/crud-list-header"
import { CrudCard } from "@/components/ui/crud-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  phone: string
  address: string
  createdAt: string
  lastLogin: string
}

export default function ManageUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [users, setUsers] = useState<User[]>([
    {
      id: "U001",
      name: "John Smith",
      email: "john@healthplus.com",
      role: "pharmacy_owner",
      status: "active",
      phone: "+1 (555) 123-4567",
      address: "123 Health St, Medical City, NY 12345",
      createdAt: "2024-01-10",
      lastLogin: "2024-01-15 14:30",
    },
    {
      id: "U002",
      name: "Sarah Johnson",
      email: "sarah@medsupply.com",
      role: "supplier",
      status: "active",
      phone: "+1 (555) 234-5678",
      address: "456 Supply Ave, Distribution Center, CA 90210",
      createdAt: "2024-01-08",
      lastLogin: "2024-01-15 10:15",
    },
    {
      id: "U003",
      name: "Mike Wilson",
      email: "mike@logistics.com",
      role: "logistics",
      status: "active",
      phone: "+1 (555) 345-6789",
      address: "789 Transport Blvd, Shipping District, TX 75001",
      createdAt: "2024-01-05",
      lastLogin: "2024-01-14 16:45",
    },
    {
      id: "U004",
      name: "Emily Davis",
      email: "emily@pharmacy.com",
      role: "cashier",
      status: "inactive",
      phone: "+1 (555) 456-7890",
      address: "321 Cashier Lane, Retail Park, FL 33101",
      createdAt: "2023-12-20",
      lastLogin: "2024-01-12 09:20",
    },
  ])

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    address: "",
    password: "",
    isActive: true,
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateUser = () => {
    const user: User = {
      id: `U${String(users.length + 1).padStart(3, "0")}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.isActive ? "active" : "inactive",
      phone: newUser.phone,
      address: newUser.address,
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
    }

    setUsers([...users, user])
    setNewUser({ name: "", email: "", role: "", phone: "", address: "", password: "", isActive: true })
    setIsCreateModalOpen(false)
  }

  const handleEditUser = () => {
    if (!selectedUser) return

    setUsers(
      users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              phone: newUser.phone,
              address: newUser.address,
              status: newUser.isActive ? "active" : "inactive",
            }
          : user,
      ),
    )
    setIsEditModalOpen(false)
    setSelectedUser(null)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return
    setUsers(users.filter((user) => user.id !== selectedUser.id))
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      password: "",
      isActive: user.status === "active",
    })
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "pharmacy_owner":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "supplier":
        return "bg-green-100 text-green-800 border-green-200"
      case "logistics":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "cashier":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <CrudListHeader
          title="Manage Users"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => setIsCreateModalOpen(true)}
          addButtonText="Add New User"
        />

        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <CrudCard
              key={user.id}
              onEdit={() => openEditModal(user)}
              onDelete={() => openDeleteDialog(user)}
              collapsible
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {{
                preview: (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                        {user.role.replace("_", " ")}
                      </Badge>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                    </div>
                  </div>
                ),
                details: (
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {user.address}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Last Login: {user.lastLogin === "Never" ? "Never" : new Date(user.lastLogin).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ),
              }}
            </CrudCard>
          ))}

          {filteredUsers.length === 0 && (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center text-gray-500">
                No users found matching your search criteria
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create User Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with the specified role and permissions.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pharmacy_owner">Pharmacy Owner</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <div>
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter temporary password"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={newUser.isActive}
                  onCheckedChange={(checked) => setNewUser({ ...newUser, isActive: checked as boolean })}
                />
                <Label htmlFor="active">Account is active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser} className="btn-primary">
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information and permissions.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pharmacy_owner">Pharmacy Owner</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-active"
                  checked={newUser.isActive}
                  onCheckedChange={(checked) => setNewUser({ ...newUser, isActive: checked as boolean })}
                />
                <Label htmlFor="edit-active">Account is active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser} className="btn-primary">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedUser?.name}? This action cannot be undone and will permanently
                remove the user account and all associated data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
