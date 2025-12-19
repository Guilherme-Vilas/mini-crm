"use client"

import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Lead, LeadStatus } from "@/types/database"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"

const STATUSES: LeadStatus[] = ["new", "contacted", "negotiation", "closed", "lost"]

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Novos",
  contacted: "Contatados",
  negotiation: "Em Negociação",
  closed: "Fechados",
  lost: "Perdidos",
}

export function KanbanBoard() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  )

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return []

      const userId = user.id
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id" as any, userId as any)
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data || []) as unknown as Lead[]
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const { error } = await (supabase
        .from("leads") as any)
        .update({ status })
        .eq("id", id)

      if (error) throw error
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["leads"] })
      const previousLeads = queryClient.getQueryData<Lead[]>(["leads"])

      queryClient.setQueryData<Lead[]>(["leads"], (old = []) =>
        old.map((lead) => (lead.id === id ? { ...lead, status } : lead))
      )

      return { previousLeads }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(["leads"], context.previousLeads)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
    },
  })

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const leadId = active.id as string
    const targetStatus = over.data.current?.status as LeadStatus

    if (targetStatus) {
      const currentLead = leads.find((lead) => lead.id === leadId)
      if (currentLead && currentLead.status !== targetStatus) {
        updateStatusMutation.mutate({ id: leadId, status: targetStatus })
      }
    }
  }

  const activeLead = activeId ? leads.find((lead) => lead.id === activeId) : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Carregando leads...</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max md:min-w-0">
          {STATUSES.map((status) => {
            const columnLeads = leads.filter((lead) => lead.status === status)
            return (
              <KanbanColumn
                key={status}
                status={status}
                title={STATUS_LABELS[status]}
                leads={columnLeads}
              />
            )
          })}
        </div>
      </div>
      <DragOverlay>
        {activeLead ? (
          <div className="opacity-90">
            <KanbanCard lead={activeLead} status={activeLead.status} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

