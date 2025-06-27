"use client"

import { useState } from "react"
import { Calendar, Package, AlertTriangle } from "lucide-react"
import { SupplierLayout } from "@/components/supplier-layout"
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

interface StockItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  price: number
  expiryDate: string
  batchNumber: string
  manufacturer: string
  description: string
  status: "in_stock" | "low_stock" | "out_of_stock" | "expired"
}

export default function ManageStockPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)

  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: "ST001",
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      quantity: 500,
      unit: "tablets",
      price: 0.25,
      expiryDate: "2025-06-15",
      batchNumber: "PAR-2024-001",
      manufacturer: "PharmaCorp",
      description: "Pain relief and fever reducer",
      status: "in_stock",
    },
    {
      id: "ST002",
      name: "Ibuprofen 400mg",
      category: "Anti-inflammatory",
      quantity: 50,
      unit: "tablets",
      price: 0.35,
      expiryDate: "2024-12-20",
      batchNumber: "IBU-2024-002",
      manufacturer: "MediLab",
      description: "Anti-inflammatory pain reliever",
      status: "low_stock",
    },
    {
      id: "ST003",
      name: "Amoxicillin 250mg",
      category: "Antibiotics",
      quantity: 0,
      unit: "capsules",
      price: 0.75,
      expiryDate: "2024-08-30",
      batchNumber: "AMX-2024-003",
      manufacturer: "BioPharm",
      description: "Broad-spectrum antibiotic",
      status: "out_of_stock",
    },
  ])

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    price: 0,
    expiryDate: "",
    batchNumber: "",
    manufacturer: "",
    description: "",
  })

  const filteredItems = stockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateItem = () => {
    const item: StockItem = {
      id: `ST${String(stockItems.length + 1).padStart(3, "0")}`,
      ...newItem,
      status: newItem.quantity > 100 ? "in_stock" : newItem.quantity > 0 ? "low_stock" : "out_of_stock",
    }

    setStockItems([...stockItems, item])
    setNewItem({
      name: "",
      category: "",
      quantity: 0,
      unit: "",
      price: 0,
      expiryDate: "",
      batchNumber: "",
      manufacturer: "",
      description: "",
    })
    setIsCreateModalOpen(false)
  }

  const handleEditItem = () => {
    if (!selectedItem) return

    setStockItems(
      stockItems.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              ...newItem,
              status: newItem.quantity > 100 ? "in_stock" : newItem.quantity > 0 ? "low_stock" : "out_of_stock",
            }
          : item,
      ),
    )
    setIsEditModalOpen(false)
    setSelectedItem(null)
  }

  const handleDeleteItem = () => {
    if (!selectedItem) return
    setStockItems(stockItems.filter((item) => item.id !== selectedItem.id))
    setIsDeleteDialogOpen(false)
    setSelectedItem(null)
  }

  const openEditModal = (item: StockItem) => {
    setSelectedItem(item)
    setNewItem({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      expiryDate: item.expiryDate,
      batchNumber: item.batchNumber,
      manufacturer: item.manufacturer,
      description: item.description,
    })
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (item: StockItem) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>
      case "low_stock":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Low Stock</Badge>
      case "out_of_stock":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Expired</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)
    return expiry <= thirtyDaysFromNow
  }

  return (
    <SupplierLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <CrudListHeader
          title="Manage Stock"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => setIsCreateModalOpen(true)}
          addButtonText="Add Stock Item"
        />

        <div className="space-y-4">
          {filteredItems.map((item, index) => (
            <CrudCard
              key={item.id}
              onEdit={() => openEditModal(item)}
              onDelete={() => openDeleteDialog(item)}
              collapsible
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {{
                preview: (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          {isExpiringSoon(item.expiryDate) && (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" title="Expiring soon" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.quantity} {item.unit} • ${item.price} each
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.category}
                      </Badge>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                ),
                details: (
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        Batch: {item.batchNumber}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Expires: {new Date(item.expiryDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Manufacturer:</strong> {item.manufacturer}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <strong>Description:</strong> {item.description}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Total Value:</strong> ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ),
              }}
            </CrudCard>
          ))}

          {filteredItems.length === 0 && (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center text-gray-500">
                No stock items found matching your search criteria
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create Stock Item Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Stock Item</DialogTitle>
              <DialogDescription>Add a new medication or product to your inventory.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                    <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                    <SelectItem value="Anti-inflammatory">Anti-inflammatory</SelectItem>
                    <SelectItem value="Vitamins">Vitamins</SelectItem>
                    <SelectItem value="Supplements">Supplements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) })}
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="capsules">Capsules</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="vials">Vials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price per Unit ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) })}
                  placeholder="Enter price"
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  value={newItem.batchNumber}
                  onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })}
                  placeholder="Enter batch number"
                />
              </div>
              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={newItem.manufacturer}
                  onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })}
                  placeholder="Enter manufacturer"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter product description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateItem} className="btn-primary">
                Add Stock Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Stock Item Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Stock Item</DialogTitle>
              <DialogDescription>Update stock item information and quantities.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                    <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                    <SelectItem value="Anti-inflammatory">Anti-inflammatory</SelectItem>
                    <SelectItem value="Vitamins">Vitamins</SelectItem>
                    <SelectItem value="Supplements">Supplements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-unit">Unit</Label>
                <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="capsules">Capsules</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="vials">Vials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-price">Price per Unit ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-expiryDate">Expiry Date</Label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-batchNumber">Batch Number</Label>
                <Input
                  id="edit-batchNumber"
                  value={newItem.batchNumber}
                  onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                <Input
                  id="edit-manufacturer"
                  value={newItem.manufacturer}
                  onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditItem} className="btn-primary">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Stock Item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedItem?.name}? This action cannot be undone and will permanently
                remove the item from your inventory.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteItem}>
                Delete Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SupplierLayout>
  )
}
