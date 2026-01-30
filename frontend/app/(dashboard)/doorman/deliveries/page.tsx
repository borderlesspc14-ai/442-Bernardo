"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Textarea } from "@/components/ui/textarea"
import { Package, Plus, Search, CheckCircle, Clock, User } from "lucide-react"
import { mockDeliveries, mockUnits } from "@/lib/mock-data"
import type { Delivery } from "@/lib/types"
import { toast } from "sonner"

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newDelivery, setNewDelivery] = useState({
    unitId: "",
    carrier: "",
    trackingCode: "",
    description: "",
  })

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.trackingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = deliveries.filter((d) => d.status === "pending").length
  const pickedUpCount = deliveries.filter((d) => d.status === "picked_up").length

  const handleAddDelivery = () => {
    if (!newDelivery.unitId || !newDelivery.carrier) {
      toast.error("Preencha os campos obrigatorios")
      return
    }

    const unit = mockUnits.find((u) => u.id === newDelivery.unitId)
    const delivery: Delivery = {
      id: `del-${Date.now()}`,
      unitId: newDelivery.unitId,
      unitNumber: unit?.number || "",
      receivedAt: new Date().toISOString(),
      receivedBy: "Porteiro",
      carrier: newDelivery.carrier,
      trackingCode: newDelivery.trackingCode || undefined,
      description: newDelivery.description || undefined,
      status: "pending",
    }

    setDeliveries([delivery, ...deliveries])
    setNewDelivery({ unitId: "", carrier: "", trackingCode: "", description: "" })
    setIsAddOpen(false)
    toast.success("Entrega registrada com sucesso")
  }

  const handlePickUp = (deliveryId: string) => {
    setDeliveries(
      deliveries.map((d) =>
        d.id === deliveryId
          ? { ...d, status: "picked_up" as const, pickedUpAt: new Date().toISOString(), pickedUpBy: "Morador" }
          : d
      )
    )
    toast.success("Entrega marcada como retirada")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-warning/20 text-warning-foreground border-warning/30"><Clock className="mr-1 h-3 w-3" />Aguardando</Badge>
      case "picked_up":
        return <Badge variant="secondary" className="bg-success/20 text-success-foreground border-success/30"><CheckCircle className="mr-1 h-3 w-3" />Retirada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entregas"
        description="Gerencie entregas e encomendas recebidas na portaria"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entregas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Retirada</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retiradas Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pickedUpCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Lista de Entregas</CardTitle>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Entrega
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Nova Entrega</DialogTitle>
                  <DialogDescription>
                    Registre uma nova entrega recebida na portaria
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Unidade *</Label>
                    <Select
                      value={newDelivery.unitId}
                      onValueChange={(value) => setNewDelivery({ ...newDelivery, unitId: value })}
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
                    <Label>Transportadora *</Label>
                    <Input
                      value={newDelivery.carrier}
                      onChange={(e) => setNewDelivery({ ...newDelivery, carrier: e.target.value })}
                      placeholder="Ex: Correios, Sedex, etc"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Codigo de Rastreio</Label>
                    <Input
                      value={newDelivery.trackingCode}
                      onChange={(e) => setNewDelivery({ ...newDelivery, trackingCode: e.target.value })}
                      placeholder="Opcional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descricao</Label>
                    <Textarea
                      value={newDelivery.description}
                      onChange={(e) => setNewDelivery({ ...newDelivery, description: e.target.value })}
                      placeholder="Descricao do pacote (opcional)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddDelivery}>Registrar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por codigo, transportadora..."
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
                <SelectItem value="pending">Aguardando</SelectItem>
                <SelectItem value="picked_up">Retiradas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Transportadora</TableHead>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Recebido em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhuma entrega encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeliveries.map((delivery) => (
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
                      <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                      <TableCell className="text-right">
                        {delivery.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePickUp(delivery.id)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Retirar
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
    </div>
  )
}
