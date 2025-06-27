"use client"

import { useState } from "react"
import { Truck, Calendar, MapPin } from "lucide-react"
import { LogisticsLayout } from "@/components/logistics-layout"
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
import { Textarea } from "@/components/ui/textarea"

interface Vehicle {
  id: string
  type: string
  licensePlate: string
  driver: string
  capacity: string
  status: "available" | "in_use" | "maintenance"
  lastMaintenance: string
  totalDistance: number
  currentLocation: string
  notes: string
}

export default function ManageVehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "VH001",
      type: "Van",
      licensePlate: "DEL-001",
      driver: "Mike Johnson",
      capacity: "500kg",
      status: "in_use",
      lastMaintenance: "2024-01-01",
      totalDistance: 15420,
      currentLocation: "Downtown Distribution Center",
      notes: "Regular delivery vehicle for city routes",
    },
    {
      id: "VH002",
      type: "Truck",
      licensePlate: "DEL-002",
      driver: "Sarah Wilson",
      capacity: "1000kg",
      status: "available",
      lastMaintenance: "2023-12-15",
      totalDistance: 28750,
      currentLocation: "Main Warehouse",
      notes: "Heavy-duty truck for large deliveries",
    },
    {
      id: "VH003",
      type: "Van",
      licensePlate: "DEL-003",
      driver: "Tom Brown",
      capacity: "500kg",
      status: "maintenance",
      lastMaintenance: "2024-01-10",
      totalDistance: 12300,
      currentLocation: "Service Center",
      notes: "Scheduled maintenance - brake system check",
    },
  ])

  const [newVehicle, setNewVehicle] = useState({
    type: "",
    licensePlate: "",
    driver: "",
    capacity: "",
    status: "available" as const,
    currentLocation: "",
    notes: "",
  })

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateVehicle = () => {
    const vehicle: Vehicle = {
      id: `VH${String(vehicles.length + 1).padStart(3, "0")}`,
      ...newVehicle,
      lastMaintenance: new Date().toISOString().split("T")[0],
      totalDistance: 0,
    }

    setVehicles([...vehicles, vehicle])
    setNewVehicle({
      type: "",
      licensePlate: "",
      driver: "",
      capacity: "",
      status: "available",
      currentLocation: "",
      notes: "",
    })
    setIsCreateModalOpen(false)
  }

  const handleEditVehicle = () => {
    if (!selectedVehicle) return

    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === selectedVehicle.id
          ? {
              ...vehicle,
              ...newVehicle,
            }
          : vehicle,
      ),
    )
    setIsEditModalOpen(false)
    setSelectedVehicle(null)
  }

  const handleDeleteVehicle = () => {
    if (!selectedVehicle) return
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== selectedVehicle.id))
    setIsDeleteDialogOpen(false)
    setSelectedVehicle(null)
  }

  const openEditModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setNewVehicle({
      type: vehicle.type,
      licensePlate: vehicle.licensePlate,
      driver: vehicle.driver,
      capacity: vehicle.capacity,
      status: vehicle.status,
      currentLocation: vehicle.currentLocation,
      notes: vehicle.notes,
    })
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsDeleteDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>
      case "in_use":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Use</Badge>
      case "maintenance":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Maintenance</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <LogisticsLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <CrudListHeader
          title="Manage Vehicles"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => setIsCreateModalOpen(true)}
          addButtonText="Add Vehicle"
        />

        <div className="space-y-4">
          {filteredVehicles.map((vehicle, index) => (
            <CrudCard
              key={vehicle.id}
              onEdit={() => openEditModal(vehicle)}
              onDelete={() => openDeleteDialog(vehicle)}
              collapsible
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {{
                preview: (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{vehicle.licensePlate}</h3>
                        <p className="text-sm text-gray-600">
                          {vehicle.type} • {vehicle.driver}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {vehicle.capacity}
                      </Badge>
                      {getStatusBadge(vehicle.status)}
                    </div>
                  </div>
                ),
                details: (
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        Current Location: {vehicle.currentLocation}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Last Maintenance: {new Date(vehicle.lastMaintenance).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4" />
                        Total Distance: {vehicle.totalDistance.toLocaleString()} km
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <strong>Notes:</strong> {vehicle.notes}
                      </div>
                    </div>
                  </div>
                ),
              }}
            </CrudCard>
          ))}

          {filteredVehicles.length === 0 && (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center text-gray-500">
                No vehicles found matching your search criteria
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create Vehicle Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>Add a new vehicle to your logistics fleet.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="type">Vehicle Type</Label>
                <Select
                  value={newVehicle.type}
                  onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="Car">Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  value={newVehicle.licensePlate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                  placeholder="Enter license plate"
                />
              </div>
              <div>
                <Label htmlFor="driver">Driver Name</Label>
                <Input
                  id="driver"
                  value={newVehicle.driver}
                  onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })}
                  placeholder="Enter driver name"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  value={newVehicle.capacity}
                  onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                  placeholder="e.g., 500kg, 1000kg"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newVehicle.status}
                  onValueChange={(value: "available" | "in_use" | "maintenance") =>
                    setNewVehicle({ ...newVehicle, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in_use">In Use</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentLocation">Current Location</Label>
                <Input
                  id="currentLocation"
                  value={newVehicle.currentLocation}
                  onChange={(e) => setNewVehicle({ ...newVehicle, currentLocation: e.target.value })}
                  placeholder="Enter current location"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newVehicle.notes}
                  onChange={(e) => setNewVehicle({ ...newVehicle, notes: e.target.value })}
                  placeholder="Enter any additional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateVehicle} className="btn-primary">
                Add Vehicle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Vehicle Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Vehicle</DialogTitle>
              <DialogDescription>Update vehicle information and status.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="edit-type">Vehicle Type</Label>
                <Select
                  value={newVehicle.type}
                  onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="Car">Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-licensePlate">License Plate</Label>
                <Input
                  id="edit-licensePlate"
                  value={newVehicle.licensePlate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-driver">Driver Name</Label>
                <Input
                  id="edit-driver"
                  value={newVehicle.driver}
                  onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="edit-capacity"
                  value={newVehicle.capacity}
                  onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={newVehicle.status}
                  onValueChange={(value: "available" | "in_use" | "maintenance") =>
                    setNewVehicle({ ...newVehicle, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in_use">In Use</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-currentLocation">Current Location</Label>
                <Input
                  id="edit-currentLocation"
                  value={newVehicle.currentLocation}
                  onChange={(e) => setNewVehicle({ ...newVehicle, currentLocation: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={newVehicle.notes}
                  onChange={(e) => setNewVehicle({ ...newVehicle, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditVehicle} className="btn-primary">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Vehicle</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete vehicle {selectedVehicle?.licensePlate}? This action cannot be undone
                and will permanently remove the vehicle from your fleet.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteVehicle}>
                Delete Vehicle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </LogisticsLayout>
  )
}
