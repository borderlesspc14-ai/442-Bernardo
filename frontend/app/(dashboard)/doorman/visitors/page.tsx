"use client"

import { useState } from "react"
import { Plus, Users, UserCheck, Clock, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { mockVisitors, getUnitById } from "@/lib/mock-data"
import { VisitorFormModal } from "@/components/modals/visitor-form-modal"
import type { Visitor } from "@/lib/types"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Aguardando", variant: "outline" },
  validated: { label: "Validado", variant: "default" },
  entered: { label: "No local", variant: "secondary" },
  exited: { label: "Saiu", variant: "outline" },
  cancelled: { label: "Cancelado", variant: "destructive" },
}

export default function VisitorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const pendingCount = mockVisitors.filter((v) => v.status === "pending").length
  const validatedCount = mockVisitors.filter((v) => v.status === "validated").length
  const enteredCount = mockVisitors.filter((v) => v.status === "entered").length

  const columns = [
    {
      key: "name",
      header: "Visitante",
      cell: (visitor: Visitor) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
            {visitor.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{visitor.name}</p>
            <p className="text-xs text-muted-foreground">{visitor.document}</p>
          </div>
        </div>
      ),
    },
    {
      key: "unit",
      header: "Destino",
      cell: (visitor: Visitor) => {
        const unit = getUnitById(visitor.unitId)
        return unit ? `${unit.number} - Bloco ${unit.block}` : "-"
      },
    },
    {
      key: "purpose",
      header: "Motivo",
      cell: (visitor: Visitor) => (
        <span className="text-sm">{visitor.purpose}</span>
      ),
    },
    {
      key: "preRegistered",
      header: "Tipo",
      cell: (visitor: Visitor) => (
        <Badge variant={visitor.preRegistered ? "secondary" : "outline"}>
          {visitor.preRegistered ? "Pre-cadastro" : "Direto"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (visitor: Visitor) => {
        const config = statusConfig[visitor.status] || statusConfig.pending
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      key: "actions",
      header: "",
      cell: (visitor: Visitor) => {
        if (visitor.status === "pending") {
          return (
            <Button size="sm">
              <UserCheck className="mr-1 size-3" />
              Validar
            </Button>
          )
        }
        if (visitor.status === "validated") {
          return (
            <Button size="sm" variant="outline">
              <LogIn className="mr-1 size-3" />
              Entrada
            </Button>
          )
        }
        if (visitor.status === "entered") {
          return (
            <Button size="sm" variant="outline">
              <LogOut className="mr-1 size-3" />
              Saida
            </Button>
          )
        }
        return null
      },
      className: "text-right",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Visitantes"
        description="Gerenciamento de visitantes e entradas"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 size-4" />
            Registrar Visitante
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockVisitors.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Aguardando</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <UserCheck className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{validatedCount}</p>
              <p className="text-sm text-muted-foreground">Validados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <LogIn className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{enteredCount}</p>
              <p className="text-sm text-muted-foreground">No local</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={mockVisitors}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Buscar visitante..."
            emptyMessage="Nenhum visitante registrado"
          />
        </CardContent>
      </Card>

      <VisitorFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}
