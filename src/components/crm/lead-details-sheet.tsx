"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Lead, Interaction } from "@/types/database"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Phone, Mail, Calendar, FileText } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { interactionSchema, type InteractionFormData } from "@/lib/validations/interaction"
import { useState } from "react"

interface LeadDetailsSheetProps {
  leadId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const interactionIcons = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
}

const interactionLabels = {
  call: "Ligação",
  email: "Email",
  meeting: "Reunião",
  note: "Nota",
}

export function LeadDetailsSheet({
  leadId,
  open,
  onOpenChange,
}: LeadDetailsSheetProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const supabase = createClient()

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single()

      if (error) throw error
      return data as Lead
    },
    enabled: open && !!leadId,
  })

  const { data: interactions = [] } = useQuery({
    queryKey: ["interactions", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interactions")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data || []) as Interaction[]
    },
    enabled: open && !!leadId,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<InteractionFormData>({
    resolver: zodResolver(interactionSchema),
    defaultValues: {
      lead_id: leadId,
      type: "note",
    },
  })

  const interactionType = watch("type")

  const createInteractionMutation = useMutation({
    mutationFn: async (data: InteractionFormData) => {
      const { error } = await supabase.from("interactions").insert(data)

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Interação adicionada com sucesso.",
      })
      queryClient.invalidateQueries({ queryKey: ["interactions", leadId] })
      reset()
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar interação",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: InteractionFormData) => {
    createInteractionMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">Carregando...</p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  if (!lead) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{lead.name}</SheetTitle>
          <SheetDescription>
            Detalhes do lead e histórico de interações
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-6 pr-4">
            {/* Lead Info */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-500">Email</Label>
                    <p className="text-sm font-medium">{lead.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Telefone</Label>
                    <p className="text-sm font-medium">{lead.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Empresa</Label>
                    <p className="text-sm font-medium">{lead.company}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Cargo</Label>
                    <p className="text-sm font-medium">{lead.role}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Status</Label>
                    <Badge className="mt-1">{lead.status}</Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Origem</Label>
                    <p className="text-sm font-medium">{lead.source}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactions Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Histórico de Interações</h3>
              <div className="space-y-4">
                {interactions.map((interaction) => {
                  const Icon = interactionIcons[interaction.type]
                  const timeAgo = formatDistanceToNow(
                    new Date(interaction.created_at),
                    { addSuffix: true, locale: ptBR }
                  )

                  return (
                    <div key={interaction.id} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {interactionLabels[interaction.type]}
                          </span>
                          <span className="text-xs text-slate-500">
                            {timeAgo}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">
                          {interaction.content}
                        </p>
                      </div>
                    </div>
                  )
                })}
                {interactions.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">
                    Nenhuma interação registrada ainda
                  </p>
                )}
              </div>
            </div>

            {/* Add Interaction Form */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Adicionar Interação</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={interactionType}
                      onValueChange={(value) => setValue("type", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Ligação</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Reunião</SelectItem>
                        <SelectItem value="note">Nota</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Input
                      id="content"
                      {...register("content")}
                      placeholder="Descreva a interação..."
                    />
                    {errors.content && (
                      <p className="text-sm text-destructive">
                        {errors.content.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Adicionando..." : "Adicionar Interação"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

