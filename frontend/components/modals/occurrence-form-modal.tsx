"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { mockUnits } from "@/lib/mock-data"
import type { Occurrence } from "@/lib/types"

interface OccurrenceFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  occurrence?: Occurrence | null
}

export function OccurrenceFormModal({ open, onOpenChange, occurrence }: OccurrenceFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "general" as "complaint" | "maintenance" | "security" | "general",
    priority: "medium" as "low" | "medium" | "high",
    status: "open" as "open" | "in_progress" | "resolved" | "closed",
    unitId: "none" as "" | "none",
  })

  useEffect(() => {
    if (occurrence) {
      setFormData({
        title: occurrence.title,
        description: occurrence.description,
        type: occurrence.type,
        priority: occurrence.priority,
        status: occurrence.status,
        unitId: occurrence.unitId || "none",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        type: "general",
        priority: "medium",
        status: "open",
        unitId: "none",
      })
    }
  }, [occurrence])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success(occurrence ? "Ocorrencia atualizada com sucesso!" : "Ocorrencia registrada com sucesso!")
    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{occurrence ? "Detalhes da Ocorrencia" : "Nova Ocorrencia"}</DialogTitle>
          <DialogDescription>
            {occurrence ? "Visualize e atualize os detalhes da ocorrencia." : "Registre uma nova ocorrencia."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titulo *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titulo da ocorrencia"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descricao *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva a ocorrencia em detalhes..."
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "complaint" | "maintenance" | "security" | "general") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Geral</SelectItem>
                  <SelectItem value="complaint">Reclamacao</SelectItem>
                  <SelectItem value="maintenance">Manutencao</SelectItem>
                  <SelectItem value="security">Seguranca</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade (opcional)</Label>
              <Select
                value={formData.unitId}
                onValueChange={(value) => setFormData({ ...formData, unitId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {mockUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.number} - Bloco {unit.block}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {occurrence && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "open" | "in_progress" | "resolved" | "closed") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
