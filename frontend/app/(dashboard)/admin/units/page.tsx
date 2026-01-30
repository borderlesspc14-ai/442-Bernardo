"use client"

import { useState } from "react"
import { Plus, Building2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { mockUnits, getResidentByUnit } from "@/lib/mock-data"
import { UnitFormModal } from "@/components/modals/unit-form-modal"
import type { Unit } from "@/lib/types"

export default function UnitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)

  const occupiedCount = mockUnits.filter((u) => u.status === "occupied").length
  const vacantCount = mockUnits.filter((u) => u.status === "vacant").length

  const columns = [
    {
      key: "number",
      header: "Unidade",
      cell: (unit: Unit) => (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded bg-primary/10 text-primary text-sm font-medium">
            {unit.block}
          </div>
          <div>
            <p className="font-medium">{unit.number}</p>
            <p className="text-xs text-muted-foreground">Bloco {unit.block}</p>
          </div>
        </div>
      ),
    },
    {
      key: "floor",
      header: "Andar",
      cell: (unit: Unit) => `${unit.floor}o andar`,
    },
    {
      key: "type",
      header: "Tipo",
      cell: (unit: Unit) => (
        <Badge variant="outline">
          {unit.type === "apartment"
            ? "Apartamento"
            : unit.type === "commercial"
              ? "Comercial"
              : "Vaga"}
        </Badge>
      ),
    },
    {
      key: "residents",
      header: "Moradores",
      cell: (unit: Unit) => {
        const residents = getResidentByUnit(unit.id)
        return (
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <span>{residents.length}</span>
          </div>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (unit: Unit) => (
        <Badge variant={unit.status === "occupied" ? "default" : "secondary"}>
          {unit.status === "occupied" ? "Ocupada" : "Vaga"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (unit: Unit) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedUnit(unit)
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
        title="Unidades"
        description="Gerenciamento de blocos e apartamentos"
        actions={
          <Button onClick={() => { setSelectedUnit(null); setIsModalOpen(true) }}>
            <Plus className="mr-2 size-4" />
            Nova Unidade
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockUnits.length}</p>
              <p className="text-sm text-muted-foreground">Total de unidades</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{occupiedCount}</p>
              <p className="text-sm text-muted-foreground">Ocupadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{vacantCount}</p>
              <p className="text-sm text-muted-foreground">Vagas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={mockUnits}
            columns={columns}
            searchKey="number"
            searchPlaceholder="Buscar unidade..."
            emptyMessage="Nenhuma unidade encontrada"
          />
        </CardContent>
      </Card>

      <UnitFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        unit={selectedUnit}
      />
    </div>
  )
}
