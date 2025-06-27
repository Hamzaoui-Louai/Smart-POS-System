"use client"

import { useState } from "react"
import { Phone, Calendar, Clock } from "lucide-react"
import { PharmacyOwnerLayout } from "@/components/pharmacy-owner-layout"
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

interface Cashier {
  id: string
  name: string
  email: string
  phone: string
  hireDate: string
  shift: "morning" | "afternoon" | "night"
  status: "active" | "inactive"
  lastLogin: string
  totalSales: number
}

export default function ManageCashiersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null)

  const [cashiers, setCashiers] = useState<Cashier[]>([
    {
      id: "C001",
      name: "Emily Davis",
      email: "emily@healthplus.com",
      phone: "+1 (555) 456-7890",
      hireDate: "2023-12-20",
      shift: "morning",
      status: "active",
      lastLogin: "2024-01-15 09:30",
      totalSales: 15420.5,
    },
    {
      id: "C002",
      name: "Michael Johnson",
      email: "michael@healthplus.com",
      phone: "+1 (555) 567-8901",
      hireDate: "2024-01-05",
      shift: "afternoon",
      status: "active",
      lastLogin: "2024-01-14 14:15",
      totalSales: 8750.25,
    },
    {
      id: "C003",
      name: "Sarah Wilson",
      email: "sarah@healthplus.com",
      phone: "+1 (555) 678-9012",
      hireDate: "2023-11-10",
      shift: "night",
      status: "inactive",
      lastLogin: "2024-01-10 22:45",
      totalSales: 12300.75,
    },
  ])

  const [newCashier, setNewCashier] = useState({
    name: "",
    email: "",
    phone: "",
    shift: "morning" as const,
    password: "",
    isActive: true,
  })

  const filteredCashiers = cashiers.filter(
    (cashier) =>
      cashier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cashier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cashier.phone.includes(searchQuery),
  )

  const handleCreateCashier = () => {
    const cashier: Cashier = {
      id: `C${String(cashiers.length + 1).padStart(3, "0")}`,
      name: newCashier.name,
      email: newCashier.email,
      phone: newCashier.phone,
      shift: newCashier.shift,
      status: newCashier.isActive ? "active" : "inactive",
      hireDate: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
      totalSales: 0,
    }

    setCashiers([...cashiers, cashier])
    setNewCashier({ name: "", email: "", phone: "", shift: "morning", password: "", isActive: true })
    setIsCreateModalOpen(false)
  }

  const handleEditCashier = () => {
    if (!selectedCashier) return

    setCashiers(
      cashiers.map((cashier) =>
        cashier.id === selectedCashier.id
          ? {
              ...cashier,
              name: newCashier.name,
              email: newCashier.email,
              phone: newCashier.phone,
              shift: newCashier.shift,
              status: newCashier.isActive ? "active" : "inactive",
            }
          : cashier,
      ),
    )
    setIsEditModalOpen(false)
    setSelectedCashier(null)
  }

  const handleDeleteCashier = () => {
    if (!selectedCashier) return
    setCashiers(cashiers.filter((cashier) => cashier.id !== selectedCashier.id))
    setIsDeleteDialogOpen(false)
    setSelectedCashier(null)
  }

  const openEditModal = (cashier: Cashier) => {
    setSelectedCashier(cashier)
    setNewCashier({
      name: cashier.name,
      email: cashier.email,
      phone: cashier.phone,
      shift: cashier.shift,
      password: "",
      isActive: cashier.status === "active",
    })
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (cashier: Cashier) => {
    setSelectedCashier(cashier)
    setIsDeleteDialogOpen(true)
  }

  const getShiftBadge = (shift: string) => {
    switch (shift) {
      case "morning":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Morning</Badge>
      case "afternoon":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Afternoon</Badge>
      case "night":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Night</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <PharmacyOwnerLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <CrudListHeader
          title="Manage Cashiers"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => setIsCreateModalOpen(true)}
          addButtonText="Add Cashier"
        />

        <div className="space-y-4">
          {filteredCashiers.map((cashier, index) => (
            <CrudCard
              key={cashier.id}
              onEdit={() => openEditModal(cashier)}
              onDelete={() => openDeleteDialog(cashier)}
              collapsible
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {{
                preview: (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{cashier.name}</h3>
                        <p className="text-sm text-gray-600">{cashier.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getShiftBadge(cashier.shift)}
                      <Badge variant={cashier.status === "active" ? "default" : "secondary"}>{cashier.status}</Badge>
                    </div>
                  </div>
                ),
                details: (
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {cashier.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Hired: {new Date(cashier.hireDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        Last Login:{" "}
                        {cashier.lastLogin === "Never" ? "Never" : new Date(cashier.lastLogin).toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <strong>Total Sales:</strong> ${cashier.totalSales.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Employee ID:</strong> {cashier.id}
                      </div>
                    </div>
                  </div>
                ),
              }}
            </CrudCard>
          ))}

          {filteredCashiers.length === 0 && (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center text-gray-500">
                No cashiers found matching your search criteria
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create Cashier Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Cashier</DialogTitle>
              <DialogDescription>Create a new cashier account for your pharmacy.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newCashier.name}
                  onChange={(e) => setNewCashier({ ...newCashier, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCashier.email}
                  onChange={(e) => setNewCashier({ ...newCashier, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newCashier.phone}
                  onChange={(e) => setNewCashier({ ...newCashier, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="shift">Shift</Label>
                <Select
                  value={newCashier.shift}
                  onValueChange={(value: "morning" | "afternoon" | "night") =>
                    setNewCashier({ ...newCashier, shift: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6AM - 2PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2PM - 10PM)</SelectItem>
                    <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newCashier.password}
                  onChange={(e) => setNewCashier({ ...newCashier, password: e.target.value })}
                  placeholder="Enter temporary password"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={newCashier.isActive}
                  onCheckedChange={(checked) => setNewCashier({ ...newCashier, isActive: checked as boolean })}
                />
                <Label htmlFor="active">Account is active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCashier} className="btn-primary">
                Create Cashier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Cashier Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Cashier</DialogTitle>
              <DialogDescription>Update cashier information and settings.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={newCashier.name}
                  onChange={(e) => setNewCashier({ ...newCashier, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newCashier.email}
                  onChange={(e) => setNewCashier({ ...newCashier, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={newCashier.phone}
                  onChange={(e) => setNewCashier({ ...newCashier, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-shift">Shift</Label>
                <Select
                  value={newCashier.shift}
                  onValueChange={(value: "morning" | "afternoon" | "night") =>
                    setNewCashier({ ...newCashier, shift: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6AM - 2PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2PM - 10PM)</SelectItem>
                    <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-active"
                  checked={newCashier.isActive}
                  onCheckedChange={(checked) => setNewCashier({ ...newCashier, isActive: checked as boolean })}
                />
                <Label htmlFor="edit-active">Account is active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCashier} className="btn-primary">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Cashier</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedCashier?.name}? This action cannot be undone and will
                permanently remove the cashier account and all associated sales data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCashier}>
                Delete Cashier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacyOwnerLayout>
  )
}
