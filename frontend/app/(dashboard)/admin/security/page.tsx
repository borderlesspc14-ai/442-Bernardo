"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Shield,
  Users,
  AlertTriangle,
  Package,
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { mockVisitors, mockOccurrences, mockDeliveries } from "@/lib/mock-data"
import type { Visitor, Occurrence, Delivery } from "@/lib/types"

export default function SecurityPage() {
  const [visitors] = useState<Visitor[]>(mockVisitors)
  const [occurrences] = useState<Occurrence[]>(mockOccurrences)
  const [deliveries] = useState<Delivery[]>(mockDeliveries)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null)

  const todayVisitors = visitors.filter((v) => {
    const today = new Date().toDateString()
    return new Date(v.entryTime).toDateString() === today
  })

  const pendingOccurrences = occurrences.filter((o) => o.status === "open" || o.status === "in_progress")
  const pendingDeliveries = deliveries.filter((d) => d.status === "pending")

  const getVisitorStatusBadge = (status: string) => {
    switch (status) {
      case "inside":
        return <Badge className="bg-success/20 text-success-foreground border-success/30">No Condominio</Badge>
      case "left":
        return <Badge variant="secondary">Saiu</Badge>
      case "expected":
        return <Badge variant="outline" className="border-primary/50 text-primary">Esperado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getOccurrenceStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" />Aberta</Badge>
      case "in_progress":
        return <Badge className="bg-warning/20 text-warning-foreground border-warning/30"><Clock className="mr-1 h-3 w-3" />Em Andamento</Badge>
      case "resolved":
        return <Badge className="bg-success/20 text-success-foreground border-success/30"><CheckCircle className="mr-1 h-3 w-3" />Resolvida</Badge>
      case "closed":
        return <Badge variant="secondary"><XCircle className="mr-1 h-3 w-3" />Fechada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Alta</Badge>
      case "medium":
        return <Badge className="bg-warning/20 text-warning-foreground">Media</Badge>
      case "low":
        return <Badge variant="secondary">Baixa</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Seguranca e Portaria"
        description="Visao geral das atividades de seguranca do condominio"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Hoje</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisitors.length}</div>
            <p className="text-xs text-muted-foreground">
              {visitors.filter((v) => v.status === "inside").length} no condominio
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrencias Abertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOccurrences.length}</div>
            <p className="text-xs text-muted-foreground">
              {occurrences.filter((o) => o.priority === "high").length} alta prioridade
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregas Pendentes</CardTitle>
            <Package className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">aguardando retirada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            <Shield className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Normal</div>
            <p className="text-xs text-muted-foreground">sem alertas criticos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitors">Visitantes</TabsTrigger>
          <TabsTrigger value="occurrences">Ocorrencias</TabsTrigger>
          <TabsTrigger value="deliveries">Entregas</TabsTrigger>
        </TabsList>

        <TabsContent value="visitors">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Visitantes Recentes</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar visitante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Saida</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitors
                      .filter((v) => v.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .slice(0, 10)
                      .map((visitor) => (
                        <TableRow key={visitor.id}>
                          <TableCell className="font-medium">{visitor.name}</TableCell>
                          <TableCell className="font-mono text-sm">{visitor.document}</TableCell>
                          <TableCell>{visitor.unitNumber}</TableCell>
                          <TableCell>
                            {new Date(visitor.entryTime).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell>
                            {visitor.exitTime
                              ? new Date(visitor.exitTime).toLocaleString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </TableCell>
                          <TableCell>{getVisitorStatusBadge(visitor.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="occurrences">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Ocorrencias</CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="open">Abertas</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="resolved">Resolvidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titulo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {occurrences.map((occurrence) => (
                      <TableRow key={occurrence.id}>
                        <TableCell className="font-medium max-w-48 truncate">
                          {occurrence.title}
                        </TableCell>
                        <TableCell className="capitalize">{occurrence.type}</TableCell>
                        <TableCell>{getPriorityBadge(occurrence.priority)}</TableCell>
                        <TableCell>{occurrence.location || "-"}</TableCell>
                        <TableCell>
                          {new Date(occurrence.createdAt).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>{getOccurrenceStatusBadge(occurrence.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOccurrence(occurrence)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>Entregas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Transportadora</TableHead>
                      <TableHead>Codigo</TableHead>
                      <TableHead>Recebido em</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.unitNumber}</TableCell>
                        <TableCell>{delivery.carrier}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {delivery.trackingCode || "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(delivery.receivedAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-warning/20 text-warning-foreground border-warning/30">
                            <Clock className="mr-1 h-3 w-3" />
                            Aguardando
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedOccurrence} onOpenChange={() => setSelectedOccurrence(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedOccurrence?.title}</DialogTitle>
            <DialogDescription>
              Detalhes da ocorrencia registrada
            </DialogDescription>
          </DialogHeader>
          {selectedOccurrence && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {getOccurrenceStatusBadge(selectedOccurrence.status)}
                {getPriorityBadge(selectedOccurrence.priority)}
                <Badge variant="outline" className="capitalize">{selectedOccurrence.type}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Local</p>
                  <p>{selectedOccurrence.location || "Nao especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data</p>
                  <p>{new Date(selectedOccurrence.createdAt).toLocaleString("pt-BR")}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Descricao</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedOccurrence.description}</p>
              </div>
              {selectedOccurrence.resolution && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Resolucao</p>
                  <p className="text-sm bg-success/10 p-3 rounded-lg">{selectedOccurrence.resolution}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
