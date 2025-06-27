"use client"

import { useState } from "react"
import { Eye, EyeOff, Save, Trash2, AlertTriangle, Shield, UserCog } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminPersonalInformationPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Admin User",
    email: "admin@pharmasphere.com",
    phone: "+1 (555) 999-0001",
    address: "123 Admin St, Management City, NY 12345",
    dateOfBirth: "1985-03-20",
    emergencyContact: "Emergency Admin - +1 (555) 999-0002",
    adminLevel: "Super Admin",
    department: "System Administration",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePersonalInfoSave = () => {
    console.log("Saving admin personal info:", personalInfo)
  }

  const handlePasswordChange = () => {
    console.log("Changing admin password")
  }

  const handleDeleteAccount = () => {
    console.log("Deleting admin account")
    setIsDeleteDialogOpen(false)
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="font-heading text-3xl font-bold text-gray-900">Admin Personal Information</h1>
          </div>
          <p className="text-gray-600">Manage your administrator account details and security settings</p>
        </div>

        {/* Admin Information Card */}
        <Card className="border-0 shadow-lg animate-slide-up">
          <CardHeader>
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Administrator Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <Input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <Input
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Level</label>
                <Input
                  value={personalInfo.adminLevel}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, adminLevel: e.target.value })}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <Input
                  value={personalInfo.department}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, department: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <Input
                value={personalInfo.address}
                onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
              />
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

        {/* Password Change Card */}
        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Change Password</CardTitle>
            <p className="text-sm text-gray-600">Update your administrator password to maintain security</p>
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

        {/* Danger Zone */}
        <Card className="border-red-200 shadow-lg animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="font-heading text-xl text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <p className="text-sm text-gray-600">Critical actions that affect the entire system</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Delete Admin Account</h3>
                <p className="text-sm text-gray-600">
                  Permanently delete your administrator account and transfer responsibilities
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
                      Delete Administrator Account
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your administrator account and remove
                      all associated privileges. Make sure another admin can take over your responsibilities.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-gray-600 mb-4">
                      To confirm deletion, please type <strong>DELETE ADMIN</strong> in the field below:
                    </p>
                    <Input placeholder="Type DELETE ADMIN to confirm" />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Admin Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
