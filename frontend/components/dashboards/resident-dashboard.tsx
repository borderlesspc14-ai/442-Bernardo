"use client"

import Link from "next/link"
import { Bell, Receipt, UserPlus, ArrowRight, Calendar, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { useAuth } from "@/lib/auth-context"
import {
  mockAnnouncements,
  mockCharges,
  mockResidents,
  getUnitById,
} from "@/lib/mock-data"

export function ResidentDashboard() {
  const { user } = useAuth()
  
  // Find resident by user email
  const resident = mockResidents.find((r) => r.email === user?.email)
  const unit = resident ? getUnitById(resident.unitId) : null
  
  // Get charges for this resident
  const residentCharges = resident 
    ? mockCharges.filter((c) => c.residentId === resident.id)
    : []
  
  const pendingCharges = residentCharges.filter(
    (c) => c.status === "pending" || c.status === "overdue"
  )
  
  const activeAnnouncements = mockAnnouncements.filter((a) => a.isActive)

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title={`Ola, ${user?.name?.split(" ")[0]}`}
        description={unit ? `Unidade ${unit.number} - Bloco ${unit.block}` : "Painel do Morador"}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Acoes Rapidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild className="w-full justify-start">
              <Link href="/resident/visitors/new">
                <UserPlus className="mr-2 size-4" />
                Pre-cadastrar Visitante
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/finance/charges">
                <Receipt className="mr-2 size-4" />
                Ver Cobrancas
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/resident/announcements">
                <Bell className="mr-2 size-4" />
                Comunicados
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Cobrancas Pendentes</CardTitle>
            <Badge variant={pendingCharges.length > 0 ? "destructive" : "secondary"}>
              {pendingCharges.length}
            </Badge>
          </CardHeader>
          <CardContent>
            {pendingCharges.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-success/10 text-success">
                  <Receipt className="size-5" />
                </div>
                <p className="mt-2 text-sm font-medium">Tudo em dia!</p>
                <p className="text-xs text-muted-foreground">Nenhuma cobranca pendente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCharges.slice(0, 2).map((charge) => (
                  <div key={charge.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{charge.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Vence: {new Date(charge.dueDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {charge.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                      <Badge
                        variant={charge.status === "overdue" ? "destructive" : "outline"}
                      >
                        {charge.status === "overdue" ? "Vencido" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="link" asChild className="h-auto p-0 text-xs">
                  <Link href="/finance/charges">
                    Ver todas
                    <ArrowRight className="ml-1 size-3" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Sua Unidade</CardTitle>
          </CardHeader>
          <CardContent>
            {unit ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bloco</span>
                  <span className="text-sm font-medium">{unit.block}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Apartamento</span>
                  <span className="text-sm font-medium">{unit.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Andar</span>
                  <span className="text-sm font-medium">{unit.floor}o</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline">
                    {resident?.isOwner ? "Proprietario" : "Inquilino"}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Unidade nao encontrada
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-4" />
            Comunicados Recentes
          </CardTitle>
          <CardDescription>Avisos e informacoes do condominio</CardDescription>
        </CardHeader>
        <CardContent>
          {activeAnnouncements.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum comunicado ativo</p>
          ) : (
            <div className="space-y-4">
              {activeAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div
                    className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      announcement.type === "emergency"
                        ? "bg-destructive/10 text-destructive"
                        : announcement.type === "maintenance"
                          ? "bg-warning/10 text-warning"
                          : announcement.type === "event"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {announcement.type === "emergency" ? (
                      <AlertCircle className="size-4" />
                    ) : announcement.type === "event" ? (
                      <Calendar className="size-4" />
                    ) : (
                      <Bell className="size-4" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium leading-none">
                        {announcement.title}
                      </h4>
                      <Badge
                        variant={
                          announcement.priority === "high" ? "destructive" : "outline"
                        }
                        className="shrink-0"
                      >
                        {announcement.priority === "high"
                          ? "Urgente"
                          : announcement.priority === "medium"
                            ? "Importante"
                            : "Informativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(announcement.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
