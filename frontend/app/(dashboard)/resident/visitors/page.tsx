"use client"

import { useState } from "react"
import { Plus, UserCheck, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { useAuth } from "@/lib/auth-context"
import { mockVisitors, mockResidents, getUnitById } from "@/lib/mock-data"
import { VisitorFormModal } from "@/components/modals/visitor-form-modal"
import type { Visitor } from "@/lib/types"

export default function ResidentVisitorsPage() {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const resident = mockResidents.find((r) => r.email === user?.email)
  const unit = resident ? getUnitById(resident.unitId) : null
  
  // Get visitors for this resident's unit
  const visitors = unit
    ? mockVisitors.filter((v) => v.unitId === unit.id && v.preRegistered)
    : []

  const columns = [
    {
      key: "name",
      header: "Nome",
      cell: (visitor: Visitor) => (
        <div>
          <p className="font-medium">{visitor.name}</p>
          <p className="text-xs text-muted-foreground">{visitor.document}</p>
        </div>
      ),
    },
    {
      key: "purpose",
      header: "Motivo",
    },
    {
      key: "createdAt",
      header: "Data Cadastro",
      cell: (visitor: Visitor) =>
        new Date(visitor.createdAt).toLocaleDateString("pt-BR"),
    },
    {
      key: "status",
      header: "Status",
      cell: (visitor: Visitor) => {
        const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
          pending: { label: "Aguardando", variant: "outline" },
          validated: { label: "Validado", variant: "default" },
          entered: { label: "No local", variant: "secondary" },
          exited: { label: "Saiu", variant: "outline" },
          cancelled: { label: "Cancelado", variant: "destructive" },
        }
        const config = statusConfig[visitor.status] || statusConfig.pending
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Pre-cadastro de Visitantes"
        description={unit ? `Unidade ${unit.number} - Bloco ${unit.block}` : "Cadastre visitantes antecipadamente"}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 size-4" />
            Novo Visitante
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {visitors.filter((v) => v.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Aguardando validacao</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <UserCheck className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {visitors.filter((v) => v.status === "validated" || v.status === "entered").length}
              </p>
              <p className="text-sm text-muted-foreground">Validados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <X className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {visitors.filter((v) => v.status === "exited" || v.status === "cancelled").length}
              </p>
              <p className="text-sm text-muted-foreground">Finalizados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={visitors}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Buscar visitante..."
            emptyMessage="Nenhum visitante pre-cadastrado"
          />
        </CardContent>
      </Card>

      <VisitorFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        unitId={unit?.id}
      />
    </div>
  )
}
