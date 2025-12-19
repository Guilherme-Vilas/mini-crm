"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { leadSchema, type LeadFormData } from "@/lib/validations/lead"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { formatPhone } from "@/lib/utils"
import { useState } from "react"

interface NewLeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewLeadDialog({ open, onOpenChange }: NewLeadDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const supabase = createClient()
  const [phoneValue, setPhoneValue] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: "new",
    },
  })

  const status = watch("status")

  const createLeadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const { error } = await supabase.from("leads").insert({
        ...data,
        user_id: user.id,
      })

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Lead criado com sucesso.",
      })
      queryClient.invalidateQueries({ queryKey: ["leads"] })
      reset()
      setPhoneValue("")
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar lead",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: LeadFormData) => {
    createLeadMutation.mutate(data)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setPhoneValue(formatted)
    setValue("phone", formatted.replace(/\D/g, ""))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
          <DialogDescription>
            Adicione um novo lead ao seu pipeline
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="João Silva"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="joao@empresa.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              value={phoneValue}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Empresa *</Label>
            <Input
              id="company"
              {...register("company")}
              placeholder="Empresa XYZ"
            />
            {errors.company && (
              <p className="text-sm text-destructive">
                {errors.company.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo *</Label>
            <Input
              id="role"
              {...register("role")}
              placeholder="CEO"
            />
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Origem *</Label>
            <Input
              id="source"
              {...register("source")}
              placeholder="Website, LinkedIn, etc."
            />
            {errors.source && (
              <p className="text-sm text-destructive">
                {errors.source.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue("status", value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="negotiation">Em Negociação</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

