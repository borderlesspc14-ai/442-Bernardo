"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DollarSign,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Receipt,
  CreditCard,
  AlertCircle,
} from "lucide-react"
import { mockPayments } from "@/lib/mock-data"
import type { Payment } from "@/lib/types"

export default function ResidentBillingPage() {
  const [payments] = useState<Payment[]>(
    mockPayments.filter((p) => p.unitId === "unit-1")
  )

  const totalPending = payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((acc, p) => acc + p.amount, 0)

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success/20 text-success-foreground border-success/30"><CheckCircle className="mr-1 h-3 w-3" />Pago</Badge>
      case "pending":
        return <Badge className="bg-warning/20 text-warning-foreground border-warning/30"><Clock className="mr-1 h-3 w-3" />Pendente</Badge>
      case "overdue":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Vencido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeName = (type: string) => {
    const names: Record<string, string> = {
      condominium: "Taxa de Condominio",
      extra: "Taxa Extra",
      fine: "Multa",
      reservation: "Reserva",
    }
    return names[type] || type
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Minhas Cobrancas"
        description="Visualize e gerencie suas cobrancas e pagamentos"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "pending" || p.status === "overdue").length} cobrancas em aberto
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago (Ano)</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "paid").length} pagamentos realizados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proximo Vencimento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10/02/2026</div>
            <p className="text-xs text-muted-foreground">em 11 dias</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Historico de Cobrancas</CardTitle>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descricao</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhuma cobranca encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.description || getTypeName(payment.type)}
                      </TableCell>
                      <TableCell>{getTypeName(payment.type)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.dueDate).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        {payment.status === "pending" || payment.status === "overdue" ? (
                          <Button size="sm">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pagar
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

      <Card>
        <CardHeader>
          <CardTitle>Formas de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Cartao de Credito</p>
                <p className="text-sm text-muted-foreground">Parcele em ate 12x</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">PIX</p>
                <p className="text-sm text-muted-foreground">Pagamento instantaneo</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Boleto</p>
                <p className="text-sm text-muted-foreground">Vencimento em 3 dias</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
