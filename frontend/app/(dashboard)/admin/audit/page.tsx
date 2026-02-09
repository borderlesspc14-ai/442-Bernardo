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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ScrollText,
  Search,
  Download,
  Eye,
  User,
  Settings,
  Shield,
  DollarSign,
  Home,
  Users,
  AlertTriangle,
} from "lucide-react"
import { mockAuditLogs } from "@/lib/mock-data"
import type { AuditLog } from "@/lib/types"

export default function AuditPage() {
  const [logs] = useState<AuditLog[]>(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [moduleFilter, setModuleFilter] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesModule = moduleFilter === "all" || log.module === moduleFilter
    return matchesSearch && matchesAction && matchesModule
  })

  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return <Badge className="bg-success/20 text-success-foreground border-success/30">Criacao</Badge>
      case "update":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Atualizacao</Badge>
      case "delete":
        return <Badge variant="destructive">Exclusao</Badge>
      case "login":
        return <Badge variant="outline">Login</Badge>
      case "logout":
        return <Badge variant="secondary">Logout</Badge>
      default:
        return <Badge variant="outline">{action}</Badge>
    }
  }

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "residents":
        return <Users className="h-4 w-4" />
      case "units":
        return <Home className="h-4 w-4" />
      case "financial":
        return <DollarSign className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "auth":
        return <User className="h-4 w-4" />
      case "settings":
        return <Settings className="h-4 w-4" />
      case "occurrences":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <ScrollText className="h-4 w-4" />
    }
  }

  const getModuleName = (module: string) => {
    const names: Record<string, string> = {
      residents: "Moradores",
      units: "Unidades",
      financial: "Financeiro",
      security: "Seguranca",
      auth: "Autenticacao",
      settings: "Configuracoes",
      occurrences: "Ocorrencias",
      visitors: "Visitantes",
      employees: "Funcionarios",
      announcements: "Comunicados",
    }
    return names[module] || module
  }

  const formatCsvValue = (value: string) => {
    const escaped = value.replace(/"/g, '""')
    return `"${escaped}"`
  }

  const handleExportCsv = () => {
    const headers = [
      "Data/Hora",
      "Usuario",
      "Modulo",
      "Acao",
      "Descricao",
      "IP",
    ]

    const rows = filteredLogs.map((log) => [
      new Date(log.timestamp).toLocaleString("pt-BR"),
      log.userName,
      getModuleName(log.module),
      log.action,
      log.description,
      log.ipAddress,
    ])

    const csv = [
      headers.map(formatCsvValue).join(","),
      ...rows.map((row) => row.map((cell) => formatCsvValue(String(cell))).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `historico-acoes-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const todayLogs = logs.filter((log) => {
    const today = new Date().toDateString()
    return new Date(log.timestamp).toDateString() === today
  })

  const uniqueUsers = new Set(logs.map((l) => l.userId)).size

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logs de Auditoria"
        description="Historico completo de acoes realizadas no sistema"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
            <ScrollText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acoes Hoje</CardTitle>
            <ScrollText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exclusoes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter((l) => l.action === "delete").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Historico de Acoes</CardTitle>
            <Button variant="outline" onClick={handleExportCsv}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuario, descricao..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Acao" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Acoes</SelectItem>
                <SelectItem value="create">Criacao</SelectItem>
                <SelectItem value="update">Atualizacao</SelectItem>
                <SelectItem value="delete">Exclusao</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Modulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Modulos</SelectItem>
                <SelectItem value="residents">Moradores</SelectItem>
                <SelectItem value="units">Unidades</SelectItem>
                <SelectItem value="financial">Financeiro</SelectItem>
                <SelectItem value="security">Seguranca</SelectItem>
                <SelectItem value="auth">Autenticacao</SelectItem>
                <SelectItem value="occurrences">Ocorrencias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Modulo</TableHead>
                  <TableHead>Acao</TableHead>
                  <TableHead>Descricao</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead className="text-right">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(log.timestamp).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{log.userName}</p>
                            <p className="text-xs text-muted-foreground capitalize">{log.userRole}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getModuleIcon(log.module)}
                          <span className="text-sm">{getModuleName(log.module)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell className="max-w-48 truncate">{log.description}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Log</DialogTitle>
            <DialogDescription>
              Informacoes completas do registro de auditoria
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {getActionBadge(selectedLog.action)}
                <Badge variant="outline" className="flex items-center gap-1">
                  {getModuleIcon(selectedLog.module)}
                  {getModuleName(selectedLog.module)}
                </Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuario</p>
                  <p>{selectedLog.userName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Funcao</p>
                  <p className="capitalize">{selectedLog.userRole}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data/Hora</p>
                  <p>{new Date(selectedLog.timestamp).toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Endereco IP</p>
                  <p className="font-mono">{selectedLog.ipAddress}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Descricao</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedLog.description}</p>
              </div>
              {selectedLog.details && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Dados Adicionais</p>
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
