"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus,
  Search,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Receipt,
} from "lucide-react"
import { mockPayments, mockUnits } from "@/lib/mock-data"
import type { Payment } from "@/lib/types"
import { toast } from "sonner"

export default function FinancialPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newPayment, setNewPayment] = useState({
    unitId: "",
    type: "condominium",
    amount: "",
    dueDate: "",
    description: "",
  })

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalReceived = payments
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0)

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((acc, p) => acc + p.amount, 0)

  const totalOverdue = payments
    .filter((p) => p.status === "overdue")
    .reduce((acc, p) => acc + p.amount, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleAddPayment = () => {
    if (!newPayment.unitId || !newPayment.amount || !newPayment.dueDate) {
      toast.error("Preencha os campos obrigatorios")
      return
    }

    const unit = mockUnits.find((u) => u.id === newPayment.unitId)
    const payment: Payment = {
      id: `pay-${Date.now()}`,
      unitId: newPayment.unitId,
      unitNumber: unit?.number || "",
      type: newPayment.type as Payment["type"],
      amount: parseFloat(newPayment.amount),
      dueDate: newPayment.dueDate,
      status: "pending",
      description: newPayment.description || undefined,
      createdAt: new Date().toISOString(),
    }

    setPayments([payment, ...payments])
    setNewPayment({ unitId: "", type: "condominium", amount: "", dueDate: "", description: "" })
    setIsAddOpen(false)
    toast.success("Cobranca criada com sucesso")
  }

  const handleMarkAsPaid = (paymentId: string) => {
    setPayments(
      payments.map((p) =>
        p.id === paymentId
          ? { ...p, status: "paid" as const, paidAt: new Date().toISOString() }
          : p
      )
    )
    toast.success("Pagamento confirmado")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success/20 text-success-foreground border-success/30"><CheckCircle className="mr-1 h-3 w-3" />Pago</Badge>
      case "pending":
        return <Badge className="bg-warning/20 text-warning-foreground border-warning/30"><Clock className="mr-1 h-3 w-3" />Pendente</Badge>
      case "overdue":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Vencido</Badge>
      case "cancelled":
        return <Badge variant="secondary">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "condominium":
        return <Badge variant="outline">Condominio</Badge>
      case "extra":
        return <Badge variant="outline" className="border-primary/50 text-primary">Extra</Badge>
      case "fine":
        return <Badge variant="outline" className="border-destructive/50 text-destructive">Multa</Badge>
      case "reservation":
        return <Badge variant="outline" className="border-chart-2/50 text-chart-2">Reserva</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "condominium":
        return "Condominio"
      case "extra":
        return "Extra"
      case "fine":
        return "Multa"
      case "reservation":
        return "Reserva"
      default:
        return type
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago"
      case "pending":
        return "Pendente"
      case "overdue":
        return "Vencido"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const formatCsvValue = (value: string) => {
    const escaped = value.replace(/"/g, '""')
    return `"${escaped}"`
  }

  const handleExportCsv = () => {
    const headers = [
      "Unidade",
      "Tipo",
      "Descricao",
      "Valor",
      "Vencimento",
      "Status",
      "Data de Pagamento",
    ]

    const rows = filteredPayments.map((payment) => [
      payment.unitNumber,
      getTypeLabel(payment.type),
      payment.description || "-",
      formatCurrency(payment.amount),
      new Date(payment.dueDate).toLocaleDateString("pt-BR"),
      getStatusLabel(payment.status),
      payment.paidAt ? new Date(payment.paidAt).toLocaleDateString("pt-BR") : "-",
    ])

    const csv = [
      headers.map(formatCsvValue).join(","),
      ...rows.map((row) => row.map((cell) => formatCsvValue(String(cell))).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cobrancas-pagamentos-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        description="Gerencie cobranças, pagamentos e fluxo de caixa do condominio"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Recebido no Mes"
          value={formatCurrency(totalReceived)}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pendente"
          value={formatCurrency(totalPending)}
          icon={Clock}
        />
        <StatsCard
          title="Em Atraso"
          value={formatCurrency(totalOverdue)}
          icon={AlertCircle}
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Total Previsto"
          value={formatCurrency(totalReceived + totalPending)}
          icon={DollarSign}
        />
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Cobrancas</TabsTrigger>
          <TabsTrigger value="reports">Relatorios</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Cobrancas e Pagamentos</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportCsv}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                  <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Cobranca
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Nova Cobranca</DialogTitle>
                        <DialogDescription>
                          Adicione uma nova cobranca para uma unidade
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Unidade *</Label>
                          <Select
                            value={newPayment.unitId}
                            onValueChange={(value) => setNewPayment({ ...newPayment, unitId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a unidade" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockUnits.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id}>
                                  {unit.block} - {unit.number}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo *</Label>
                          <Select
                            value={newPayment.type}
                            onValueChange={(value) => setNewPayment({ ...newPayment, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de cobranca" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="condominium">Taxa de Condominio</SelectItem>
                              <SelectItem value="extra">Taxa Extra</SelectItem>
                              <SelectItem value="fine">Multa</SelectItem>
                              <SelectItem value="reservation">Reserva</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Valor (R$) *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newPayment.amount}
                            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                            placeholder="0,00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Vencimento *</Label>
                          <Input
                            type="date"
                            value={newPayment.dueDate}
                            onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Descricao</Label>
                          <Input
                            value={newPayment.description}
                            onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                            placeholder="Descricao opcional"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddPayment}>Criar Cobranca</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por unidade, descricao..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="paid">Pagos</SelectItem>
                    <SelectItem value="overdue">Vencidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descricao</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Nenhuma cobranca encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.unitNumber}</TableCell>
                          <TableCell>{getTypeBadge(payment.type)}</TableCell>
                          <TableCell className="max-w-32 truncate">
                            {payment.description || "-"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            {new Date(payment.dueDate).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell className="text-right">
                            {payment.status === "pending" || payment.status === "overdue" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsPaid(payment.id)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Confirmar
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm">
                                <Receipt className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Receitas por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de Condominio</span>
                    <span className="font-medium">{formatCurrency(45000)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-3/4 rounded-full bg-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxas Extras</span>
                    <span className="font-medium">{formatCurrency(8500)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-1/4 rounded-full bg-chart-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Multas</span>
                    <span className="font-medium">{formatCurrency(2200)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-1/12 rounded-full bg-destructive" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reservas</span>
                    <span className="font-medium">{formatCurrency(1800)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-1/12 rounded-full bg-chart-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  Despesas do Mes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Folha de Pagamento</span>
                    <span className="font-medium">{formatCurrency(18000)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-1/2 rounded-full bg-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Manutencao</span>
                    <span className="font-medium">{formatCurrency(5500)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-1/6 rounded-full bg-chart-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Energia</span>
                    <span className="font-medium">{formatCurrency(4200)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-1/8 rounded-full bg-chart-3" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Agua</span>
                    <span className="font-medium">{formatCurrency(3100)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-1/12 rounded-full bg-chart-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
