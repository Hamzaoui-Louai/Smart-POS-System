"use client"

import { useState } from "react"
import { Search, Plus, Minus, ShoppingCart, Printer, QrCode, Trash2 } from "lucide-react"
import { CashierLayout } from "@/components/cashier-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Medication {
  id: string
  name: string
  category: string
  price: number
  stock: number
  description: string
}

interface CartItem {
  medication: Medication
  quantity: number
}

export default function PointOfSalePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false)

  const [medications] = useState<Medication[]>([
    {
      id: "M001",
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      price: 0.25,
      stock: 500,
      description: "Pain relief and fever reducer",
    },
    {
      id: "M002",
      name: "Ibuprofen 400mg",
      category: "Anti-inflammatory",
      price: 0.35,
      stock: 300,
      description: "Anti-inflammatory pain reliever",
    },
    {
      id: "M003",
      name: "Vitamin D3 1000IU",
      category: "Vitamins",
      price: 0.15,
      stock: 200,
      description: "Vitamin D supplement",
    },
    {
      id: "M004",
      name: "Aspirin 325mg",
      category: "Pain Relief",
      price: 0.2,
      stock: 400,
      description: "Pain relief and blood thinner",
    },
    {
      id: "M005",
      name: "Multivitamin",
      category: "Vitamins",
      price: 1.5,
      stock: 150,
      description: "Daily multivitamin supplement",
    },
  ])

  const filteredMedications = medications.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const addToCart = (medication: Medication, quantity = 1) => {
    const existingItem = cart.find((item) => item.medication.id === medication.id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.medication.id === medication.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, medication.stock) }
            : item,
        ),
      )
    } else {
      setCart([...cart, { medication, quantity: Math.min(quantity, medication.stock) }])
    }
  }

  const updateCartQuantity = (medicationId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(medicationId)
      return
    }

    const medication = medications.find((m) => m.id === medicationId)
    if (!medication) return

    setCart(
      cart.map((item) =>
        item.medication.id === medicationId ? { ...item, quantity: Math.min(newQuantity, medication.stock) } : item,
      ),
    )
  }

  const removeFromCart = (medicationId: string) => {
    setCart(cart.filter((item) => item.medication.id !== medicationId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.medication.price * item.quantity, 0)
  }

  const handlePrintReceipt = () => {
    console.log("Printing receipt...")
    // Reset cart after printing
    setCart([])
    setQrCodeGenerated(false)
  }

  const handleGenerateQR = () => {
    setQrCodeGenerated(true)
  }

  const clearCart = () => {
    setCart([])
    setQrCodeGenerated(false)
  }

  return (
    <CashierLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="animate-fade-in">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">Point of Sale</h1>
          <p className="text-gray-600">Process customer transactions and manage sales</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Section - Medication Search & Cart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Total */}
            <Card className="border-0 shadow-lg animate-slide-up">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Current Total: ${getTotalPrice().toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Search Section */}
            <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search for medications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {filteredMedications.map((medication) => (
                    <div
                      key={medication.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{medication.name}</h4>
                        <p className="text-sm text-gray-600">{medication.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {medication.category}
                          </Badge>
                          <span className="text-sm text-gray-500">Stock: {medication.stock}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">${medication.price.toFixed(2)}</span>
                        <Button
                          onClick={() => addToCart(medication)}
                          className="btn-primary"
                          disabled={medication.stock === 0}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cart List */}
            <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Shopping Cart ({cart.length} items)
                </CardTitle>
                {cart.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear Cart
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Cart is empty</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.medication.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.medication.name}</h4>
                          <p className="text-sm text-gray-600">${item.medication.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(item.medication.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(item.medication.id, item.quantity + 1)}
                              disabled={item.quantity >= item.medication.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <span className="font-bold w-20 text-right">
                            ${(item.medication.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.medication.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Receipt & QR Code */}
          <div className="space-y-6">
            {/* Mini Receipt */}
            <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "300ms" }}>
              <CardHeader>
                <CardTitle className="text-center">Receipt Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center border-b pb-2">
                  <h3 className="font-bold">HealthPlus Pharmacy</h3>
                  <p className="text-sm text-gray-600">123 Health St, Medical City</p>
                  <p className="text-sm text-gray-600">Phone: (555) 123-4567</p>
                </div>

                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.medication.id} className="flex justify-between text-sm">
                      <span>
                        {item.medication.name} x{item.quantity}
                      </span>
                      <span>${(item.medication.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button onClick={handlePrintReceipt} className="w-full btn-primary" disabled={cart.length === 0}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print Receipt
                  </Button>
                  <Button onClick={handleGenerateQR} className="w-full btn-secondary" disabled={cart.length === 0}>
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Section */}
            <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <CardTitle className="text-center">Payment QR Code</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {qrCodeGenerated ? (
                  <div className="space-y-4">
                    <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">QR Code for</p>
                        <p className="font-bold">${getTotalPrice().toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Customer can scan this QR code to pay</p>
                  </div>
                ) : (
                  <div className="w-48 h-48 mx-auto bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500 text-center">
                      QR code not generated yet
                      <br />
                      <span className="text-sm">Click "Generate QR Code" to create</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CashierLayout>
  )
}
