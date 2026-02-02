"use client"

import Link from "next/link"
import { UserPlus, CheckCircle, AlertTriangle, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { mockVisitors, mockDoormanEvents, mockOccurrences, getUnitById } from "@/lib/mock-data"

const pendingVisitors = mockVisitors.filter((v) => v.status === "pending" || v.status === "validated")
const openOccurrences = mockOccurrences.filter((o) => o.status === "open" || o.status === "in_progress")

export function EmployeeDashboard() {
  const recentEvents = mockDoormanEvents.slice(0, 8)

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Painel da Portaria"
        description="Controle de acesso e registro de eventos"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Acoes Rapidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild className="w-full justify-start">
              <Link href="/doorman/visitors">
                <UserPlus className="mr-2 size-4" />
                Registrar Visitante
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/doorman/visitors?status=pending">
                <CheckCircle className="mr-2 size-4" />
                Validar Pre-cadastro
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/doorman/occurrence">
                <AlertTriangle className="mr-2 size-4" />
                Registrar Ocorrencia
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Visitantes Aguardando</CardTitle>
            <Badge variant="secondary">{pendingVisitors.length}</Badge>
          </CardHeader>
          <CardContent>
            {pendingVisitors.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum visitante aguardando</p>
            ) : (
              <div className="space-y-3">
                {pendingVisitors.slice(0, 3).map((visitor) => {
                  const unit = getUnitById(visitor.unitId)
                  return (
                    <div key={visitor.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{visitor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {unit ? `${unit.number} - Bloco ${unit.block}` : ""}
                        </p>
                      </div>
                      <Badge variant={visitor.status === "pending" ? "outline" : "default"}>
                        {visitor.status === "pending" ? "Aguardando" : "Validado"}
                      </Badge>
                    </div>
                  )
                })}
                {pendingVisitors.length > 3 && (
                  <Button variant="link" asChild className="h-auto p-0 text-xs">
                    <Link href="/doorman/visitors">
                      Ver todos ({pendingVisitors.length})
                      <ArrowRight className="ml-1 size-3" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Ocorrencias Abertas</CardTitle>
            <Badge variant={openOccurrences.length > 0 ? "destructive" : "secondary"}>
              {openOccurrences.length}
            </Badge>
          </CardHeader>
          <CardContent>
            {openOccurrences.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma ocorrencia aberta</p>
            ) : (
              <div className="space-y-3">
                {openOccurrences.slice(0, 3).map((occurrence) => (
                  <div key={occurrence.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{occurrence.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {occurrence.type === "complaint"
                          ? "Reclamacao"
                          : occurrence.type === "maintenance"
                            ? "Manutencao"
                            : occurrence.type === "security"
                              ? "Seguranca"
                              : "Geral"}
                      </p>
                    </div>
                    <Badge
                      variant={occurrence.priority === "high" ? "destructive" : "outline"}
                    >
                      {occurrence.priority === "high"
                        ? "Alta"
                        : occurrence.priority === "medium"
                          ? "Media"
                          : "Baixa"}
                    </Badge>
                  </div>
                ))}
                {openOccurrences.length > 3 && (
                  <Button variant="link" asChild className="h-auto p-0 text-xs">
                    <Link href="/doorman/occurrences">
                      Ver todas ({openOccurrences.length})
                      <ArrowRight className="ml-1 size-3" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-4" />
            Registro de Eventos
          </CardTitle>
          <CardDescription>Ultimas entradas e saidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.map((event) => {
              const unit = event.unitId ? getUnitById(event.unitId) : null
              return (
                <div
                  key={event.id}
                  className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 size-2 rounded-full ${
                        event.type === "entry"
                          ? "bg-success"
                          : event.type === "exit"
                            ? "bg-muted-foreground"
                            : event.type === "visitor"
                              ? "bg-primary"
                              : event.type === "delivery"
                                ? "bg-warning"
                                : "bg-destructive"
                      }`}
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {event.description}
                      </p>
                      {unit && (
                        <p className="text-xs text-muted-foreground">
                          Unidade: {unit.number} - Bloco {unit.block}
                        </p>
                      )}
                    </div>
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
                      {event.type === "entry"
                        ? "Entrada"
                        : event.type === "exit"
                          ? "Saida"
                          : event.type === "visitor"
                            ? "Visitante"
                            : event.type === "delivery"
                              ? "Entrega"
                              : "Ocorrencia"}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
