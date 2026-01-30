"use client"

import React from "react"

import Link from "next/link"
import { DoorOpen, UserPlus, CheckCircle, AlertTriangle, Clock, ArrowUpRight, ArrowDownLeft, Package, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { mockDoormanEvents, mockVisitors, getUnitById } from "@/lib/mock-data"

const todayEvents = mockDoormanEvents.filter((e) => {
  const eventDate = new Date(e.createdAt).toDateString()
  const today = new Date().toDateString()
  return eventDate === today
})

const pendingVisitors = mockVisitors.filter((v) => v.status === "pending" || v.status === "validated")

const eventTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  entry: { icon: ArrowUpRight, color: "bg-success/10 text-success", label: "Entrada" },
  exit: { icon: ArrowDownLeft, color: "bg-muted text-muted-foreground", label: "Saida" },
  visitor: { icon: Users, color: "bg-primary/10 text-primary", label: "Visitante" },
  delivery: { icon: Package, color: "bg-warning/10 text-warning", label: "Entrega" },
  occurrence: { icon: AlertTriangle, color: "bg-destructive/10 text-destructive", label: "Ocorrencia" },
}

export default function DoormanPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Portaria"
        description="Controle de acesso e registro de eventos"
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/doorman/occurrences/new">
                <AlertTriangle className="mr-2 size-4" />
                Nova Ocorrencia
              </Link>
            </Button>
            <Button asChild>
              <Link href="/doorman/visitors/new">
                <UserPlus className="mr-2 size-4" />
                Registrar Entrada
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayEvents.length}</p>
              <p className="text-sm text-muted-foreground">Eventos hoje</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <ArrowUpRight className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {todayEvents.filter((e) => e.type === "entry").length}
              </p>
              <p className="text-sm text-muted-foreground">Entradas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <CheckCircle className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingVisitors.length}</p>
              <p className="text-sm text-muted-foreground">Aguardando</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <ArrowDownLeft className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {todayEvents.filter((e) => e.type === "exit").length}
              </p>
              <p className="text-sm text-muted-foreground">Saidas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-4" />
              Eventos Recentes
            </CardTitle>
            <CardDescription>Ultimos registros de entrada e saida</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDoormanEvents.slice(0, 10).map((event) => {
                const unit = event.unitId ? getUnitById(event.unitId) : null
                const config = eventTypeConfig[event.type] || eventTypeConfig.entry
                const Icon = config.icon

                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${config.color}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {event.description}
                      </p>
                      {unit && (
                        <p className="text-xs text-muted-foreground">
                          Unidade: {unit.number} - Bloco {unit.block}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="size-4" />
                Aguardando Validacao
              </CardTitle>
              <Badge variant="secondary">{pendingVisitors.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {pendingVisitors.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum visitante aguardando
              </p>
            ) : (
              <div className="space-y-4">
                {pendingVisitors.map((visitor) => {
                  const unit = getUnitById(visitor.unitId)
                  return (
                    <div
                      key={visitor.id}
                      className="flex items-start justify-between gap-3 rounded-lg border p-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{visitor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {unit ? `${unit.number} - Bloco ${unit.block}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {visitor.purpose}
                        </p>
                      </div>
                      <Button size="sm" variant={visitor.status === "pending" ? "default" : "outline"}>
                        {visitor.status === "pending" ? "Validar" : "Entrada"}
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
