"use client"

import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Lead, LeadStatus } from "@/types/database"
import { KanbanCard } from "./kanban-card"
import { Card } from "@/components/ui/card"

interface KanbanColumnProps {
  status: LeadStatus
  title: string
  leads: Lead[]
}

export function KanbanColumn({
  status,
  title,
  leads,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      type: "column",
      status,
    },
  })

  return (
    <div className="flex-shrink-0 w-80">
      <Card className="bg-white shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{leads.length} leads</p>
        </div>
        <div
          ref={setNodeRef}
          className="p-4 space-y-3 min-h-[400px] max-h-[calc(100vh-250px)] overflow-y-auto"
        >
          <SortableContext
            items={leads.map((lead) => lead.id)}
            strategy={verticalListSortingStrategy}
          >
            {leads.map((lead) => (
              <KanbanCard key={lead.id} lead={lead} status={status} />
            ))}
          </SortableContext>
          {leads.length === 0 && (
            <div className="text-center text-slate-400 py-8 text-sm">
              Nenhum lead nesta coluna
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

