"use client"

import { useAuth } from "@/lib/auth-context"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { EmployeeDashboard } from "@/components/dashboards/employee-dashboard"
import { ResidentDashboard } from "@/components/dashboards/resident-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  switch (user.role) {
    case "admin":
      return <AdminDashboard />
    case "employee":
      return <EmployeeDashboard />
    case "resident":
      return <ResidentDashboard />
    default:
      return null
  }
}
