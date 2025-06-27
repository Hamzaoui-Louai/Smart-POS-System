"use client"

import { useState } from "react"
import { Truck, MapPin, Package, Calendar, Check } from "lucide-react"
import { SupplierLayout } from "@/components/supplier-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface DeliveryOrder {
  id: string
  pharmacyName: string
  pharmacyAddress: string
  orderDate: string
  requestedMeds: Array<{
    name: string
    quantity: number
    unit: string
  }>
  totalValue: number
  status: "ready_for_delivery" | "vehicle_assigned" | "in_transit" | "delivered"
  assignedVehicle?: string
}

interface Vehicle {
  id: string
  type: string
  licensePlate: string
  driver: string
  capacity: string
  status: "available" | "in_use" | "maintenance"
}

export default function DeliveryPage() {
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([
    {
      id: "ORD003",
      pharmacyName: "Wellness Pharmacy",
      pharmacyAddress: "789 Wellness Blvd, Care Center, TX 75001",
      orderDate: "2024-01-13",
      requestedMeds: [{ name: "Aspirin 325mg", quantity: 200, unit: "tablets" }],
      totalValue: 15.0,
      status: "ready_for_delivery",
    },
    {
      id: "ORD004",
      pharmacyName: "City Health Store",
      pharmacyAddress: "321 Health Ave, Downtown, FL 33101",
      orderDate: "2024-01-12",
      requestedMeds: [
        { name: "Vitamin C 500mg", quantity: 100, unit: "tablets" },
        { name: "Multivitamin", quantity: 50, unit: "bottles" },
      ],
      totalValue: 75.0,
      status: "vehicle_assigned",
      assignedVehicle: "VH001",
    },
  ])

  const [vehicles] = useState<Vehicle[]>([
    {
      id: "VH001",
      type: "Van",
      licensePlate: "DEL-001",
      driver: "Mike Johnson",
      capacity: "500kg",
      status: "in_use",
    },
    {
      id: "VH002",
      type: "Truck",
      licensePlate: "DEL-002",
      driver: "Sarah Wilson",
      capacity: "1000kg",
      status: "available",
    },
    {
      id: "VH003",
      type: "Van",
      licensePlate: "DEL-003",
      driver: "Tom Brown",
      capacity: "500kg",
      status: "available",
    },
  ])

  const availableVehicles = vehicles.filter((vehicle) => vehicle.status === "available")

  const handleAssignVehicle = () => {
    if (!selectedOrder || !selectedVehicle) return

    setDeliveryOrders(
      deliveryOrders.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, status: "vehicle_assigned", assignedVehicle: selectedVehicle }
          : order,
      ),
    )
    setIsAssignDialogOpen(false)
    setSelectedOrder(null)
    setSelectedVehicle("")
  }

  const handleMarkInTransit = (orderId: string) => {
    setDeliveryOrders(
      deliveryOrders.map((order) => (order.id === orderId ? { ...order, status: "in_transit" } : order)),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready_for_delivery":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ready for Delivery</Badge>
      case "vehicle_assigned":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Vehicle Assigned</Badge>
      case "in_transit":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">In Transit</Badge>
      case "delivered":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Delivered</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const openAssignDialog = (order: DeliveryOrder) => {
    setSelectedOrder(order)
    setIsAssignDialogOpen(true)
  }

  const getVehicleInfo = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId)
  }

  return (
    <SupplierLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-fade-in">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">Delivery Management</h1>
          <p className="text-gray-600">Assign vehicles to confirmed orders and track delivery status</p>
        </div>

        {/* Delivery Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Ready for Delivery</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {deliveryOrders.filter((o) => o.status === "ready_for_delivery").length}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Transit</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {deliveryOrders.filter((o) => o.status === "in_transit").length}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Available Vehicles</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{availableVehicles.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Orders */}
        <div className="space-y-4">
          {deliveryOrders.map((order, index) => (
            <Card
              key={order.id}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{order.pharmacyName}</CardTitle>
                    <p className="text-sm text-gray-600">Order #{order.id}</p>
                  </div>
                  <div className="flex items-center gap-2">{getStatusBadge(order.status)}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Order Date: {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {order.pharmacyAddress}
                    </div>
                    {order.assignedVehicle && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4" />
                        Vehicle: {getVehicleInfo(order.assignedVehicle)?.licensePlate} (
                        {getVehicleInfo(order.assignedVehicle)?.driver})
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">${order.totalValue.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Medications:</h4>
                  <div className="space-y-1">
                    {order.requestedMeds.map((med, medIndex) => (
                      <div key={medIndex} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{med.name}</span>
                        <span className="text-gray-600">
                          {med.quantity} {med.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === "ready_for_delivery" && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button onClick={() => openAssignDialog(order)} className="btn-primary flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Assign Vehicle
                    </Button>
                  </div>
                )}

                {order.status === "vehicle_assigned" && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() => handleMarkInTransit(order.id)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Mark In Transit
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {deliveryOrders.length === 0 && (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center text-gray-500">No delivery orders available</CardContent>
            </Card>
          )}
        </div>

        {/* Assign Vehicle Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Vehicle</DialogTitle>
              <DialogDescription>
                Select an available vehicle for order #{selectedOrder?.id} to {selectedOrder?.pharmacyName}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="vehicle">Available Vehicles</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.licensePlate} - {vehicle.type} ({vehicle.driver}) - {vehicle.capacity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignVehicle} className="btn-primary" disabled={!selectedVehicle}>
                Assign Vehicle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SupplierLayout>
  )
}
