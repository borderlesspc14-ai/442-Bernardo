"use client"

import { Home, Users, Receipt, Phone, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { useAuth } from "@/lib/auth-context"
import { mockResidents, mockCharges, getUnitById, getResidentByUnit } from "@/lib/mock-data"

export default function ResidentUnitPage() {
  const { user } = useAuth()
  const resident = mockResidents.find((r) => r.email === user?.email)
  const unit = resident ? getUnitById(resident.unitId) : null
  const unitResidents = unit ? getResidentByUnit(unit.id) : []
  const unitCharges = unit ? mockCharges.filter((c) => c.unitId === unit.id) : []

  if (!unit || !resident) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <PageHeader title="Minha Unidade" />
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Unidade nao encontrada
          </CardContent>
        </Card>
      </div>
    )
  }

  const paidCharges = unitCharges.filter((c) => c.status === "paid").length
  const pendingCharges = unitCharges.filter((c) => c.status === "pending" || c.status === "overdue").length

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Minha Unidade"
        description={`${unit.number} - Bloco ${unit.block}`}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="size-4" />
              Informacoes da Unidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Bloco</p>
                <p className="text-lg font-semibold">{unit.block}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Numero</p>
                <p className="text-lg font-semibold">{unit.number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Andar</p>
                <p className="text-lg font-semibold">{unit.floor}o</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="text-lg font-semibold capitalize">
                  {unit.type === "apartment"
                    ? "Apartamento"
                    : unit.type === "commercial"
                      ? "Comercial"
                      : "Vaga"}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-2">Status</p>
              <Badge variant="outline" className="text-success border-success">
                {unit.status === "occupied" ? "Ocupado" : "Vago"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="size-4" />
              Resumo Financeiro
            </CardTitle>
            <CardDescription>Historico de pagamentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-success">{paidCharges}</p>
                <p className="text-sm text-muted-foreground">Pagos</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-destructive">{pendingCharges}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
            {pendingCharges > 0 && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm">
                <p className="font-medium text-destructive">Atencao</p>
                <p className="text-muted-foreground">
                  Voce possui {pendingCharges} cobranca(s) pendente(s)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" />
            Moradores da Unidade
          </CardTitle>
          <CardDescription>
            {unitResidents.length} morador(es) registrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {unitResidents.map((res) => (
              <div
                key={res.id}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {res.name.charAt(0)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{res.name}</p>
                    {res.isOwner && (
                      <Badge variant="secondary">Proprietario</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-3" />
                    {res.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="size-3" />
                    {res.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
