export type UserRole = "guest" | "client" | "admin" | "pharmacy_owner" | "supplier" | "logistics" | "cashier"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
}

export interface RolePermissions {
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
  canManageUsers: boolean
  canViewReports: boolean
  canManageInventory: boolean
  canProcessOrders: boolean
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  guest: {
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false,
    canManageUsers: false,
    canViewReports: false,
    canManageInventory: false,
    canProcessOrders: false,
  },
  client: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canManageUsers: false,
    canViewReports: false,
    canManageInventory: false,
    canProcessOrders: true,
  },
  admin: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canManageUsers: true,
    canViewReports: true,
    canManageInventory: true,
    canProcessOrders: true,
  },
  pharmacy_owner: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canManageUsers: true,
    canViewReports: true,
    canManageInventory: true,
    canProcessOrders: true,
  },
  supplier: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canManageUsers: false,
    canViewReports: true,
    canManageInventory: true,
    canProcessOrders: true,
  },
  logistics: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canManageUsers: false,
    canViewReports: true,
    canManageInventory: false,
    canProcessOrders: true,
  },
  cashier: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canManageUsers: false,
    canViewReports: false,
    canManageInventory: false,
    canProcessOrders: true,
  },
}
