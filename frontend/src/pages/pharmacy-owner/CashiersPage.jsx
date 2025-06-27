"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Calendar, Clock, DollarSign } from "lucide-react"
import { PharmacyOwnerLayout } from "@/components/layouts/PharmacyOwnerLayout"
import { CrudListHeader } from "@/components/ui/CrudListHeader"
import { CrudCard } from "@/components/ui/CrudCard"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Label } from "@/components/ui/Label"
import { Checkbox } from "@/components/ui/Checkbox"

export default function PharmacyOwnerCashiersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCashier, setSelectedCashier] = useState(null)

  const [cashiers, setCashiers] = useState([
    {
      id: "C001",
      name: "Emily Davis",
      email: "emily@healthplus.com",
      phone: "+1 (555) 456-7890",
      shift: "morning",
      shiftTime: "8:00 AM - 4:00 PM",
      status: "active",
      hireDate: "2024-01-15",
      totalSales: 15420.5,
      lastLogin: "2024-01-15 14:30",
      performance: "excellent",
    },
    {
      id: "C002",
      name: "Michael Johnson",
      email: "michael@healthplus.com",
      phone: "+1 (555) 567-8901",
      shift: "afternoon",
      shiftTime: "2:00 PM - 10:00 PM",
      status: "active",
      hireDate: "2023-11-20",
      totalSales: 22150.75,
      lastLogin: "2024-01-14 18:45",
      performance: "good",
    },
    {
      id: "C003",
      name: "Sarah Wilson",
      email: "sarah@healthplus.com",
      phone: "+1 (555) 678-9012",
      shift: "night",
      shiftTime: "6:00 PM - 2:00 AM",
      status: "inactive",
      hireDate: "2023-08-10",
      totalSales: 8750.25,
      lastLogin: "2024-01-10 22:15",
      performance: "average",
    },
  ])

  const [newCashier, setNewCashier] = useState({
    name: "",
    email: "",
    phone: "",
    shift: "",
    password: "",
    isActive: true,
  })

  const filteredCashiers = cashiers.filter(
    (cashier) =>
      cashier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cashier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cashier.shift.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateCashier = () => {
    const shiftTimes = {
      morning: "8:00 AM - 4:00 PM",
      afternoon: "2:00 PM - 10:00 PM",
      night: "6:00 PM - 2:00 AM",
    }

    const cashier = {
      id: `C${String(cashiers.length + 1).padStart(3, "0")}`,
      name: newCashier.name,
      email: newCashier.email,
      phone: newCashier.phone,
      shift: newCashier.shift,
      shiftTime: shiftTimes[newCashier.shift],
      status: newCashier.isActive ? "active" : "inactive",
      hireDate: new Date().toISOString().split("T")[0],
      totalSales: 0,
      lastLogin: "Never",
      performance: "new",
    }

    setCashiers([...cashiers, cashier])
    setNewCashier({ name: "", email: "", phone: "", shift: "", password: "", isActive: true })
    setIsCreateModalOpen(false)
  }

  const handleEditCashier = () => {
    if (!selectedCashier) return

    const shiftTimes = {
      morning: "8:00 AM - 4:00 PM",
      afternoon: "2:00 PM - 10:00 PM",
      night: "6:00 PM - 2:00 AM",
    }

    setCashiers(
      cashiers.map((cashier) =>
        cashier.id === selectedCashier.id
          ? {
              ...cashier,
              name: newCashier.name,
              email: newCashier.email,
              phone: newCashier.phone,
              shift: newCashier.shift,
              shiftTime: shiftTimes[newCashier.shift],
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

  const openEditModal = (cashier) => {
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

  const openDeleteDialog = (cashier) => {
    setSelectedCashier(cashier)
    setIsDeleteDialogOpen(true)
  }

  const getShiftBadgeColor = (shift) => {
    switch (shift) {
      case "morning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "afternoon":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "night":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPerformanceBadge = (performance) => {
    switch (performance) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Good</Badge>
      case "average":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Average</Badge>
      case "new":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">New</Badge>
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
            <motion.div
              key={cashier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <CrudCard onEdit={() => openEditModal(cashier)} onDelete={() => openDeleteDialog(cashier)} collapsible>
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
                        <Badge variant="outline" className={getShiftBadgeColor(cashier.shift)}>
                          {cashier.shift}
                        </Badge>
                        {getPerformanceBadge(cashier.performance)}
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
                          <Clock className="w-4 h-4" />
                          Shift: {cashier.shiftTime}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Hired: {new Date(cashier.hireDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          Total Sales: ${cashier.totalSales.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Last Login:{" "}
                          {cashier.lastLogin === "Never" ? "Never" : new Date(cashier.lastLogin).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ),
                }}
              </CrudCard>
            </motion.div>
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
              <DialogDescription>Create a new cashier account with shift assignment.</DialogDescription>
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
                <Label htmlFor="shift">Shift Assignment</Label>
                <Select
                  value={newCashier.shift}
                  onValueChange={(value) => setNewCashier({ ...newCashier, shift: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8:00 AM - 4:00 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2:00 PM - 10:00 PM)</SelectItem>
                    <SelectItem value="night">Night (6:00 PM - 2:00 AM)</SelectItem>
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
                  onCheckedChange={(checked) => setNewCashier({ ...newCashier, isActive: checked })}
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
              <DialogDescription>Update cashier information and shift assignment.</DialogDescription>
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
                <Label htmlFor="edit-shift">Shift Assignment</Label>
                <Select
                  value={newCashier.shift}
                  onValueChange={(value) => setNewCashier({ ...newCashier, shift: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8:00 AM - 4:00 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2:00 PM - 10:00 PM)</SelectItem>
                    <SelectItem value="night">Night (6:00 PM - 2:00 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-active"
                  checked={newCashier.isActive}
                  onCheckedChange={(checked) => setNewCashier({ ...newCashier, isActive: checked })}
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
                permanently remove the cashier account and all associated data.
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
