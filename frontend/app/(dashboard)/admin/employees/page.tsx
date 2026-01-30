"use client"

import { useState } from "react"
import { Plus, Users, Shield, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { mockUsers } from "@/lib/mock-data"
import { EmployeeFormModal } from "@/components/modals/employee-form-modal"
import type { User } from "@/lib/types"

const employees = mockUsers.filter((u) => u.role === "admin" || u.role === "employee")

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  employee: "Funcionario",
}

export default function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null)

  const adminCount = employees.filter((e) => e.role === "admin").length
  const employeeCount = employees.filter((e) => e.role === "employee").length

  const columns = [
    {
      key: "name",
      header: "Nome",
      cell: (employee: User) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
            {employee.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{employee.name}</p>
            <p className="text-xs text-muted-foreground">{employee.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Telefone",
    },
    {
      key: "role",
      header: "Cargo",
      cell: (employee: User) => (
        <Badge variant={employee.role === "admin" ? "default" : "secondary"}>
          {roleLabels[employee.role]}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Cadastro",
      cell: (employee: User) =>
        new Date(employee.createdAt).toLocaleDateString("pt-BR"),
    },
    {
      key: "actions",
      header: "",
      cell: (employee: User) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedEmployee(employee)
            setIsModalOpen(true)
          }}
        >
          Editar
        </Button>
      ),
      className: "text-right",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Funcionarios"
        description="Gerenciamento de funcionarios e administradores"
        actions={
          <Button onClick={() => { setSelectedEmployee(null); setIsModalOpen(true) }}>
            <Plus className="mr-2 size-4" />
            Novo Funcionario
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employees.length}</p>
              <p className="text-sm text-muted-foreground">Total de funcionarios</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Shield className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{adminCount}</p>
              <p className="text-sm text-muted-foreground">Administradores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <UserCog className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employeeCount}</p>
              <p className="text-sm text-muted-foreground">Funcionarios</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={employees}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Buscar funcionario..."
            emptyMessage="Nenhum funcionario encontrado"
          />
        </CardContent>
      </Card>

      <EmployeeFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        employee={selectedEmployee}
      />
    </div>
  )
}
