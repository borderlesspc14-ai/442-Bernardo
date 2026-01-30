export type UserRole = "admin" | "employee" | "resident"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  unitId?: string
  phone?: string
  createdAt: string
}

export interface Unit {
  id: string
  block: string
  number: string
  floor: number
  type: "apartment" | "commercial" | "parking"
  status: "occupied" | "vacant"
  residents: string[]
}

export interface Resident {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  unitId: string
  isOwner: boolean
  isActive: boolean
  createdAt: string
}

export interface Visitor {
  id: string
  name: string
  document: string
  phone?: string
  unitId: string
  unitNumber: string
  purpose: string
  vehiclePlate?: string
  preRegistered: boolean
  validatedAt?: string
  validatedBy?: string
  entryTime: string
  exitTime?: string
  status: "pending" | "inside" | "left" | "expected" | "cancelled"
  createdAt: string
}

export interface Occurrence {
  id: string
  title: string
  description: string
  type: "complaint" | "maintenance" | "security" | "general"
  priority: "low" | "medium" | "high"
  status: "open" | "in_progress" | "resolved" | "closed"
  reportedBy: string
  location?: string
  unitId?: string
  resolution?: string
  createdAt: string
  resolvedAt?: string
}

export interface Charge {
  id: string
  unitId: string
  residentId: string
  description: string
  amount: number
  dueDate: string
  status: "pending" | "paid" | "overdue"
  paymentLink?: string
  boletoCode?: string
  paidAt?: string
  createdAt: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  type: "general" | "maintenance" | "emergency" | "event"
  priority: "low" | "medium" | "high"
  authorId: string
  isActive: boolean
  expiresAt?: string
  createdAt: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: string
  action: "create" | "update" | "delete" | "login" | "logout"
  module: string
  description: string
  details?: Record<string, unknown>
  ipAddress: string
  timestamp: string
}

export interface DoormanEvent {
  id: string
  type: "entry" | "exit" | "visitor" | "delivery" | "occurrence"
  description: string
  visitorId?: string
  unitId?: string
  registeredBy: string
  createdAt: string
}

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  role: "doorman" | "cleaner" | "maintenance" | "security" | "admin"
  shift?: "morning" | "afternoon" | "night"
  isActive: boolean
  hireDate: string
  createdAt: string
}

export interface Payment {
  id: string
  unitId: string
  unitNumber: string
  type: "condominium" | "extra" | "fine" | "reservation"
  amount: number
  dueDate: string
  status: "pending" | "paid" | "overdue" | "cancelled"
  description?: string
  paidAt?: string
  createdAt: string
}

export interface Delivery {
  id: string
  unitId: string
  unitNumber: string
  receivedAt: string
  receivedBy: string
  carrier: string
  trackingCode?: string
  description?: string
  status: "pending" | "picked_up"
  pickedUpAt?: string
  pickedUpBy?: string
}
