"use client"

import React from "react"

import { useState } from "react"
import { Plus, Bell, AlertCircle, Calendar, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { mockAnnouncements } from "@/lib/mock-data"
import { AnnouncementFormModal } from "@/components/modals/announcement-form-modal"
import type { Announcement } from "@/lib/types"

const typeLabels: Record<string, string> = {
  general: "Geral",
  maintenance: "Manutencao",
  emergency: "Emergencia",
  event: "Evento",
}

const typeIcons: Record<string, React.ElementType> = {
  general: Bell,
  maintenance: Wrench,
  emergency: AlertCircle,
  event: Calendar,
}

export default function AnnouncementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  const activeCount = mockAnnouncements.filter((a) => a.isActive).length

  const columns = [
    {
      key: "title",
      header: "Titulo",
      cell: (announcement: Announcement) => {
        const Icon = typeIcons[announcement.type] || Bell
        return (
          <div className="flex items-center gap-3">
            <div
              className={`flex size-8 items-center justify-center rounded-lg ${
                announcement.type === "emergency"
                  ? "bg-destructive/10 text-destructive"
                  : announcement.type === "maintenance"
                    ? "bg-warning/10 text-warning"
                    : announcement.type === "event"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="size-4" />
            </div>
            <div>
              <p className="font-medium">{announcement.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {announcement.content}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      key: "type",
      header: "Tipo",
      cell: (announcement: Announcement) => (
        <Badge variant="outline">{typeLabels[announcement.type]}</Badge>
      ),
    },
    {
      key: "priority",
      header: "Prioridade",
      cell: (announcement: Announcement) => (
        <Badge
          variant={
            announcement.priority === "high"
              ? "destructive"
              : announcement.priority === "medium"
                ? "secondary"
                : "outline"
          }
        >
          {announcement.priority === "high"
            ? "Alta"
            : announcement.priority === "medium"
              ? "Media"
              : "Baixa"}
        </Badge>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      cell: (announcement: Announcement) => (
        <Badge variant={announcement.isActive ? "default" : "secondary"}>
          {announcement.isActive ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Data",
      cell: (announcement: Announcement) =>
        new Date(announcement.createdAt).toLocaleDateString("pt-BR"),
    },
    {
      key: "actions",
      header: "",
      cell: (announcement: Announcement) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedAnnouncement(announcement)
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
        title="Comunicados"
        description="Gerenciamento de comunicados e avisos"
        actions={
          <Button onClick={() => { setSelectedAnnouncement(null); setIsModalOpen(true) }}>
            <Plus className="mr-2 size-4" />
            Novo Comunicado
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bell className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockAnnouncements.length}</p>
              <p className="text-sm text-muted-foreground">Total de comunicados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <Bell className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockAnnouncements.filter((a) => a.type === "emergency" && a.isActive).length}
              </p>
              <p className="text-sm text-muted-foreground">Emergencias ativas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={mockAnnouncements}
            columns={columns}
            searchKey="title"
            searchPlaceholder="Buscar comunicado..."
            emptyMessage="Nenhum comunicado encontrado"
          />
        </CardContent>
      </Card>

      <AnnouncementFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        announcement={selectedAnnouncement}
      />
    </div>
  )
}
