"use client"

import { Users, Building2, Receipt, AlertTriangle, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/stats-card"
import { PageHeader } from "@/components/page-header"
import {
  mockResidents,
  mockUnits,
  mockCharges,
  mockDoormanEvents,
  mockOccurrences,
  getUnitById,
} from "@/lib/mock-data"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const occupiedUnits = mockUnits.filter((u) => u.status === "occupied").length
const pendingCharges = mockCharges.filter((c) => c.status === "pending" || c.status === "overdue").length
const openOccurrences = mockOccurrences.filter((o) => o.status === "open" || o.status === "in_progress").length

const monthlyData = [
  { month: "Ago", receita: 4200, inadimplencia: 850 },
  { month: "Set", receita: 5100, inadimplencia: 600 },
  { month: "Out", receita: 4800, inadimplencia: 1200 },
  { month: "Nov", receita: 5950, inadimplencia: 400 },
  { month: "Dez", receita: 5100, inadimplencia: 850 },
  { month: "Jan", receita: 4250, inadimplencia: 1700 },
]

const occurrencesByType = [
  { type: "Manutencao", count: 12 },
  { type: "Reclamacao", count: 8 },
  { type: "Seguranca", count: 3 },
  { type: "Geral", count: 5 },
]

export function AdminDashboard() {
  const recentEvents = mockDoormanEvents.slice(0, 5)

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Dashboard Administrativo"
        description="Visao geral do condominio"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Moradores"
          value={mockResidents.length}
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          description="vs. mes anterior"
        />
        <StatsCard
          title="Unidades Ocupadas"
          value={`${occupiedUnits}/${mockUnits.length}`}
          icon={Building2}
          description={`${Math.round((occupiedUnits / mockUnits.length) * 100)}% de ocupacao`}
        />
        <StatsCard
          title="Cobrancas Pendentes"
          value={pendingCharges}
          icon={Receipt}
          trend={{ value: 12, isPositive: false }}
          description="a receber"
        />
        <StatsCard
          title="Ocorrencias Abertas"
          value={openOccurrences}
          icon={AlertTriangle}
          description="aguardando resolucao"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Receita x Inadimplencia
            </CardTitle>
            <CardDescription>Ultimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                receita: { label: "Receita", color: "var(--color-chart-1)" },
                inadimplencia: { label: "Inadimplencia", color: "var(--color-chart-5)" },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `R$${value / 1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="receita"
                    stackId="1"
                    stroke="var(--color-chart-1)"
                    fill="var(--color-chart-1)"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="inadimplencia"
                    stackId="2"
                    stroke="var(--color-chart-5)"
                    fill="var(--color-chart-5)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Ocorrencias por Tipo</CardTitle>
            <CardDescription>Distribuicao do mes atual</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Quantidade", color: "var(--color-chart-2)" },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occurrencesByType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="type" type="category" className="text-xs" width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-chart-2)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-4" />
              Ultimos Eventos da Portaria
            </CardTitle>
            <CardDescription>Atividades recentes</CardDescription>
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
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {event.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
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
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cobrancas Pendentes</CardTitle>
            <CardDescription>Unidades com pagamento em aberto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCharges
                .filter((c) => c.status === "pending" || c.status === "overdue")
                .slice(0, 5)
                .map((charge) => {
                  const unit = getUnitById(charge.unitId)
                  return (
                    <div
                      key={charge.id}
                      className="flex items-center justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {unit ? `${unit.number} - Bloco ${unit.block}` : "Unidade"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {charge.description}
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
                          variant={charge.status === "overdue" ? "destructive" : "secondary"}
                          className="mt-1"
                        >
                          {charge.status === "overdue" ? "Vencido" : "Pendente"}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
