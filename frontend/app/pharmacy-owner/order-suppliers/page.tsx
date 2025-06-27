"use client"

import { useState } from "react"
import { Store, Plus, Minus, ShoppingCart, Check } from "lucide-react"
import { PharmacyOwnerLayout } from "@/components/pharmacy-owner-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Supplier {
  id: string
  name: string
  rating: number
  location: string
  specialties: string[]
  verified: boolean
  deliveryTime: string
}

interface Medication {
  id: string
  name: string
  category: string
  price: number
  minOrder: number
  available: boolean
}

interface OrderItem {
  medication: Medication
  quantity: number
}

export default function OrderFromSuppliersPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

  const [suppliers] = useState<Supplier[]>([
    {
      id: "SUP001",
      name: "MedSupply Co.",
      rating: 4.8,
      location: "Distribution Center, CA",
      specialties: ["Pain Relief", "Antibiotics", "Vitamins"],
      verified: true,
      deliveryTime: "2-3 days",
    },
    {
      id: "SUP002",
      name: "PharmaCorp",
      rating: 4.6,
      location: "Medical District, NY",
      specialties: ["Anti-inflammatory", "Diabetes", "Heart Medication"],
      verified: true,
      deliveryTime: "1-2 days",
    },
    {
      id: "SUP003",
      name: "BioPharm",
      rating: 4.7,
      location: "Healthcare Hub, TX",
      specialties: ["Antibiotics", "Vaccines", "Specialty Drugs"],
      verified: true,
      deliveryTime: "3-5 days",
    },
  ])

  const [medications] = useState<Medication[]>([
    {
      id: "M001",
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      price: 0.25,
      minOrder: 100,
      available: true,
    },
    {
      id: "M002",
      name: "Ibuprofen 400mg",
      category: "Anti-inflammatory",
      price: 0.35,
      minOrder: 50,
      available: true,
    },
    {
      id: "M003",
      name: "Amoxicillin 250mg",
      category: "Antibiotics",
      price: 0.75,
      minOrder: 30,
      available: true,
    },
    {
      id: "M004",
      name: "Vitamin D3 1000IU",
      category: "Vitamins",
      price: 0.15,
      minOrder: 200,
      available: true,
    },
    {
      id: "M005",
      name: "Aspirin 325mg",
      category: "Pain Relief",
      price: 0.2,
      minOrder: 150,
      available: false,
    },
  ])

  const filteredMedications = medications.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openOrderModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setOrderItems([])
    setIsOrderModalOpen(true)
  }

  const addToOrder = (medication: Medication, quantity: number) => {
    const existingItem = orderItems.find((item) => item.medication.id === medication.id)

    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.medication.id === medication.id
            ? { ...item, quantity: Math.max(item.quantity + quantity, medication.minOrder) }
            : item,
        ),
      )
    } else {
      setOrderItems([...orderItems, { medication, quantity: Math.max(quantity, medication.minOrder) }])
    }
  }

  const updateOrderQuantity = (medicationId: string, newQuantity: number) => {
    const medication = medications.find((m) => m.id === medicationId)
    if (!medication) return

    if (newQuantity < medication.minOrder) {
      removeFromOrder(medicationId)
      return
    }

    setOrderItems(
      orderItems.map((item) => (item.medication.id === medicationId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const removeFromOrder = (medicationId: string) => {
    setOrderItems(orderItems.filter((item) => item.medication.id !== medicationId))
  }

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.medication.price * item.quantity, 0)
  }

  const handleConfirmOrder = () => {
    setIsOrderModalOpen(false)
    setIsConfirmModalOpen(true)
  }

  const handlePlaceOrder = () => {
    console.log("Placing order with", selectedSupplier?.name, orderItems)
    setIsConfirmModalOpen(false)
    setOrderItems([])
    setSelectedSupplier(null)
  }

  return (
    <PharmacyOwnerLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-fade-in">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">Order from Suppliers</h1>
          <p className="text-gray-600">Browse verified suppliers and place orders for your pharmacy</p>
        </div>

        {/* Suppliers List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier, index) => (
            <Card
              key={supplier.id}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => openOrderModal(supplier)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Store className="w-8 h-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">{supplier.name}</CardTitle>
                      <p className="text-sm text-gray-600">{supplier.location}</p>
                    </div>
                  </div>
                  {supplier.verified && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-lg">{supplier.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < Math.floor(supplier.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Delivery</p>
                    <p className="font-medium">{supplier.deliveryTime}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {supplier.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full btn-primary">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Place Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Modal */}
        <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order from {selectedSupplier?.name}</DialogTitle>
              <DialogDescription>
                Select medications and quantities for your order. Minimum order quantities apply.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search medications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Medications List */}
              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {filteredMedications.map((medication) => (
                  <div
                    key={medication.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      medication.available ? "hover:bg-gray-50" : "bg-gray-100 opacity-60"
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{medication.name}</h4>
                      <p className="text-sm text-gray-600">{medication.category}</p>
                      <p className="text-xs text-gray-500">Min order: {medication.minOrder} units</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">${medication.price.toFixed(2)}</span>
                      <Button
                        onClick={() => addToOrder(medication, medication.minOrder)}
                        className="btn-primary"
                        disabled={!medication.available}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              {orderItems.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div
                        key={item.medication.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium">{item.medication.name}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrderQuantity(item.medication.id, item.quantity - 10)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-16 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrderQuantity(item.medication.id, item.quantity + 10)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <span className="w-20 text-right font-bold">
                            ${(item.medication.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-2 border-t">
                    <span className="font-bold text-lg">Total: ${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmOrder} className="btn-primary" disabled={orderItems.length === 0}>
                Review Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Modal */}
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Order</DialogTitle>
              <DialogDescription>
                Please review your order details before placing the order with {selectedSupplier?.name}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Order Summary</h4>
                {orderItems.map((item) => (
                  <div key={item.medication.id} className="flex justify-between text-sm">
                    <span>
                      {item.medication.name} x{item.quantity}
                    </span>
                    <span>${(item.medication.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Supplier:</strong> {selectedSupplier?.name}
                </p>
                <p>
                  <strong>Estimated Delivery:</strong> {selectedSupplier?.deliveryTime}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
                Back to Edit
              </Button>
              <Button onClick={handlePlaceOrder} className="btn-primary">
                <Check className="w-4 h-4 mr-2" />
                Place Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacyOwnerLayout>
  )
}
