"use client"

import { useState } from "react"
import { Plus, Users, UserCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { mockResidents, getUnitById } from "@/lib/mock-data"
import { ResidentFormModal } from "@/components/modals/resident-form-modal"
import type { Resident } from "@/lib/types"

export default function ResidentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)

  const activeCount = mockResidents.filter((r) => r.isActive).length
  const ownersCount = mockResidents.filter((r) => r.isOwner).length

  const columns = [
    {
      key: "name",
      header: "Nome",
      cell: (resident: Resident) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
            {resident.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{resident.name}</p>
            <p className="text-xs text-muted-foreground">{resident.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Telefone",
    },
    {
      key: "unit",
      header: "Unidade",
      cell: (resident: Resident) => {
        const unit = getUnitById(resident.unitId)
        return unit ? `${unit.number} - Bloco ${unit.block}` : "-"
      },
    },
    {
      key: "isOwner",
      header: "Tipo",
      cell: (resident: Resident) => (
        <Badge variant={resident.isOwner ? "default" : "outline"}>
          {resident.isOwner ? "Proprietario" : "Inquilino"}
        </Badge>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      cell: (resident: Resident) => (
        <Badge variant={resident.isActive ? "secondary" : "destructive"}>
          {resident.isActive ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (resident: Resident) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedResident(resident)
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
        title="Moradores"
        description="Gerenciamento de moradores do condominio"
        actions={
          <Button onClick={() => { setSelectedResident(null); setIsModalOpen(true) }}>
            <Plus className="mr-2 size-4" />
            Novo Morador
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
              <p className="text-2xl font-bold">{mockResidents.length}</p>
              <p className="text-sm text-muted-foreground">Total de moradores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <UserCheck className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <UserX className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{ownersCount}</p>
              <p className="text-sm text-muted-foreground">Proprietarios</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={mockResidents}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Buscar morador..."
            emptyMessage="Nenhum morador encontrado"
          />
        </CardContent>
      </Card>

      <ResidentFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        resident={selectedResident}
      />
    </div>
  )
}
