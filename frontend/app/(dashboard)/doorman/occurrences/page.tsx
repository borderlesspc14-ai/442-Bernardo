"use client"

import React from "react"

import { useState } from "react"
import { Plus, AlertTriangle, Wrench, Shield, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { mockOccurrences, getUnitById } from "@/lib/mock-data"
import { OccurrenceFormModal } from "@/components/modals/occurrence-form-modal"
import type { Occurrence } from "@/lib/types"

const typeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  complaint: { icon: AlertTriangle, label: "Reclamacao", color: "bg-warning/10 text-warning" },
  maintenance: { icon: Wrench, label: "Manutencao", color: "bg-primary/10 text-primary" },
  security: { icon: Shield, label: "Seguranca", color: "bg-destructive/10 text-destructive" },
  general: { icon: FileText, label: "Geral", color: "bg-muted text-muted-foreground" },
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  open: { label: "Aberto", variant: "destructive" },
  in_progress: { label: "Em andamento", variant: "secondary" },
  resolved: { label: "Resolvido", variant: "default" },
  closed: { label: "Fechado", variant: "outline" },
}

const priorityConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  low: { label: "Baixa", variant: "outline" },
  medium: { label: "Media", variant: "secondary" },
  high: { label: "Alta", variant: "destructive" },
}

export default function OccurrencesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null)

  const openCount = mockOccurrences.filter((o) => o.status === "open").length
  const inProgressCount = mockOccurrences.filter((o) => o.status === "in_progress").length
  const resolvedCount = mockOccurrences.filter((o) => o.status === "resolved" || o.status === "closed").length

  const columns = [
    {
      key: "title",
      header: "Ocorrencia",
      cell: (occurrence: Occurrence) => {
        const config = typeConfig[occurrence.type] || typeConfig.general
        const Icon = config.icon
        return (
          <div className="flex items-center gap-3">
            <div className={`flex size-8 items-center justify-center rounded-lg ${config.color}`}>
              <Icon className="size-4" />
            </div>
            <div>
              <p className="font-medium">{occurrence.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {occurrence.description}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      key: "type",
      header: "Tipo",
      cell: (occurrence: Occurrence) => {
        const config = typeConfig[occurrence.type] || typeConfig.general
        return <Badge variant="outline">{config.label}</Badge>
      },
    },
    {
      key: "unit",
      header: "Unidade",
      cell: (occurrence: Occurrence) => {
        if (!occurrence.unitId) return "-"
        const unit = getUnitById(occurrence.unitId)
        return unit ? `${unit.number} - Bloco ${unit.block}` : "-"
      },
    },
    {
      key: "priority",
      header: "Prioridade",
      cell: (occurrence: Occurrence) => {
        const config = priorityConfig[occurrence.priority] || priorityConfig.low
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (occurrence: Occurrence) => {
        const config = statusConfig[occurrence.status] || statusConfig.open
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      key: "createdAt",
      header: "Data",
      cell: (occurrence: Occurrence) =>
        new Date(occurrence.createdAt).toLocaleDateString("pt-BR"),
    },
    {
      key: "actions",
      header: "",
      cell: (occurrence: Occurrence) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedOccurrence(occurrence)
            setIsModalOpen(true)
          }}
        >
          Detalhes
        </Button>
      ),
      className: "text-right",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Ocorrencias"
        description="Registro e acompanhamento de ocorrencias"
        actions={
          <Button onClick={() => { setSelectedOccurrence(null); setIsModalOpen(true) }}>
            <Plus className="mr-2 size-4" />
            Nova Ocorrencia
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockOccurrences.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{openCount}</p>
              <p className="text-sm text-muted-foreground">Abertas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Wrench className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProgressCount}</p>
              <p className="text-sm text-muted-foreground">Em andamento</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <CheckCircle className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{resolvedCount}</p>
              <p className="text-sm text-muted-foreground">Resolvidas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={mockOccurrences}
            columns={columns}
            searchKey="title"
            searchPlaceholder="Buscar ocorrencia..."
            emptyMessage="Nenhuma ocorrencia registrada"
          />
        </CardContent>
      </Card>

      <OccurrenceFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        occurrence={selectedOccurrence}
      />
    </div>
  )
}
