"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  employee: "Funcionario",
  resident: "Morador",
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!user) return
    setForm((prev) => ({
      ...prev,
      name: user.name ?? "",
      email: user.email ?? "",
    }))
  }, [user])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) return null

  const resetForm = () => {
    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleSave = () => {
    if (form.newPassword || form.confirmPassword) {
      if (form.newPassword !== form.confirmPassword) {
        toast({
          title: "Senha nao confere",
          description: "A confirmacao precisa ser igual a nova senha.",
          variant: "destructive",
        })
        return
      }
    }

    toast({
      title: "Perfil atualizado",
      description: "Alteracoes salvas localmente.",
    })
    setIsEditing(false)
    setForm((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Perfil"
        description="Dados basicos do usuario"
        actions={
          isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm()
                  setIsEditing(false)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Editar</Button>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Informacoes pessoais</CardTitle>
          <CardDescription>Dados principais da sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="rounded-lg border px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Perfil</p>
              <p className="font-medium">
                {user.role ? roleLabels[user.role] : "Nao definido"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail</label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha atual</label>
              <Input
                type="password"
                value={form.currentPassword}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nova senha</label>
              <Input
                type="password"
                value={form.newPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Confirmar nova senha</label>
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                }
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
