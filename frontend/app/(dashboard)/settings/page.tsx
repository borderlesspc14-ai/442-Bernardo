"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
} from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const [settings, setSettings] = useState({
    condominiumName: "Residencial CondoGest",
    address: "Rua das Flores, 123",
    phone: "(11) 98765-4321",
    email: "contato@condogest.com",
    emailNotifications: true,
    pushNotifications: false,
    securityAlerts: true,
    maintenanceAlerts: true,
    financialAlerts: true,
  })

  const handleSave = () => {
    toast({
      title: "Configuracoes salvas",
      description: "Suas preferencias foram atualizadas com sucesso.",
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Configuracoes"
        description="Gerencie as configuracoes do sistema"
        actions={
          <Button onClick={handleSave}>
            <Save className="mr-2 size-4" />
            Salvar Alteracoes
          </Button>
        }
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="size-5" />
                <CardTitle>Informacoes Gerais</CardTitle>
              </div>
              {!isAdmin && (
                <Badge variant="secondary">Somente leitura</Badge>
              )}
            </div>
            <CardDescription>
              Dados basicos do condominio {!isAdmin && "(apenas administradores podem editar)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Condominio</Label>
                <Input
                  id="name"
                  value={settings.condominiumName}
                  onChange={(e) => setSettings({ ...settings, condominiumName: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereco</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="size-5" />
              <CardTitle>Notificacoes</CardTitle>
            </div>
            <CardDescription>
              Configure como voce deseja receber notificacoes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificacoes por E-mail</Label>
                <p className="text-sm text-muted-foreground">
                  Receba atualizacoes importantes por e-mail
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificacoes Push</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificacoes no navegador
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Seguranca</Label>
                <p className="text-sm text-muted-foreground">
                  Notificacoes sobre ocorrencias e seguranca
                </p>
              </div>
              <Switch
                checked={settings.securityAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, securityAlerts: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Manutencao</Label>
                <p className="text-sm text-muted-foreground">
                  Avisos sobre manutencoes programadas
                </p>
              </div>
              <Switch
                checked={settings.maintenanceAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceAlerts: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas Financeiros</Label>
                <p className="text-sm text-muted-foreground">
                  Lembretes de vencimentos e cobranças
                </p>
              </div>
              <Switch
                checked={settings.financialAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, financialAlerts: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="size-5" />
              <CardTitle>Aparencia</CardTitle>
            </div>
            <CardDescription>
              Personalize a interface do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use o botao de tema no canto superior direito para alternar entre modo claro e escuro.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="size-5" />
              <CardTitle>Seguranca</CardTitle>
            </div>
            <CardDescription>
              Configure opcoes de seguranca e privacidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">
              Alterar Senha
            </Button>
            <p className="text-sm text-muted-foreground">
              Recomendamos trocar sua senha regularmente para manter sua conta segura.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="size-5" />
              <CardTitle>Sobre o Sistema</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Versao</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ultima atualizacao</span>
              <span className="font-medium">09/02/2026</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
