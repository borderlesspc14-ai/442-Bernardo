"use client"

import React from "react"

import { Bell, AlertCircle, Calendar, Wrench } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { mockAnnouncements } from "@/lib/mock-data"

const typeIcons: Record<string, React.ElementType> = {
  emergency: AlertCircle,
  maintenance: Wrench,
  event: Calendar,
  general: Bell,
}

const typeLabels: Record<string, string> = {
  emergency: "Emergencia",
  maintenance: "Manutencao",
  event: "Evento",
  general: "Geral",
}

export default function ResidentAnnouncementsPage() {
  const announcements = mockAnnouncements.filter((a) => a.isActive)

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Comunicados"
        description="Avisos e informacoes do condominio"
      />

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="mx-auto size-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">Nenhum comunicado</p>
            <p className="text-sm text-muted-foreground">
              Nao ha comunicados ativos no momento
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => {
            const Icon = typeIcons[announcement.type] || Bell
            return (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                          announcement.type === "emergency"
                            ? "bg-destructive/10 text-destructive"
                            : announcement.type === "maintenance"
                              ? "bg-warning/10 text-warning"
                              : announcement.type === "event"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {new Date(announcement.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {typeLabels[announcement.type]}
                      </Badge>
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
                          ? "Urgente"
                          : announcement.priority === "medium"
                            ? "Importante"
                            : "Informativo"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                  {announcement.expiresAt && (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Valido ate:{" "}
                      {new Date(announcement.expiresAt).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
