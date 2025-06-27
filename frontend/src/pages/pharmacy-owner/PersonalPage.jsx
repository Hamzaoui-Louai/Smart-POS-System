"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Save, Trash2, AlertTriangle, Building } from "lucide-react"
import { PharmacyOwnerLayout } from "@/components/layouts/PharmacyOwnerLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"

export default function PharmacyOwnerPersonalPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [personalInfo, setPersonalInfo] = useState({
    pharmacyName: "HealthPlus Pharmacy",
    ownerName: "John Smith",
    email: "john@healthplus.com",
    phone: "+1 (555) 123-4567",
    address: "123 Health St, Medical City, NY 12345",
    licenseNumber: "PH-2024-001",
    taxId: "12-3456789",
    operatingHours: "8:00 AM - 10:00 PM",
    emergencyContact: "Jane Smith - +1 (555) 987-6543",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePersonalInfoSave = () => {
    console.log("Saving pharmacy owner personal info:", personalInfo)
  }

  const handlePasswordChange = () => {
    console.log("Changing pharmacy owner password")
  }

  const handleDeleteAccount = () => {
    console.log("Deleting pharmacy owner account")
    setIsDeleteDialogOpen(false)
  }

  return (
    <PharmacyOwnerLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <Building className="w-8 h-8 text-blue-600" />
            <h1 className="font-heading text-3xl font-bold text-gray-900">Pharmacy Information</h1>
          </div>
          <p className="text-gray-600">Manage your pharmacy details and business information</p>
        </motion.div>

        {/* Pharmacy Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <Building className="w-5 h-5" />
                Pharmacy Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy Name</label>
                  <Input
                    value={personalInfo.pharmacyName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, pharmacyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                  <Input
                    value={personalInfo.ownerName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, ownerName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy Address</label>
                <Input
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <Input
                    value={personalInfo.licenseNumber}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, licenseNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                  <Input
                    value={personalInfo.taxId}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, taxId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
                  <Input
                    value={personalInfo.operatingHours}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, operatingHours: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                <Input
                  value={personalInfo.emergencyContact}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, emergencyContact: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handlePersonalInfoSave} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Password Change Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Change Password</CardTitle>
              <p className="text-sm text-gray-600">Update your account password to maintain security</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handlePasswordChange} className="btn-primary">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-red-200 shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <p className="text-sm text-gray-600">Actions that will affect your pharmacy account permanently</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Delete Pharmacy Account</h3>
                  <p className="text-sm text-gray-600">
                    Permanently delete your pharmacy account and all associated data
                  </p>
                </div>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Delete Pharmacy Account
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your pharmacy account, remove all
                        inventory data, and cancel any pending orders.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-gray-600 mb-4">
                        To confirm deletion, please type <strong>DELETE PHARMACY</strong> in the field below:
                      </p>
                      <Input placeholder="Type DELETE PHARMACY to confirm" />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PharmacyOwnerLayout>
  )
}
