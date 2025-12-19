"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Lead, LeadStatus } from "@/types/database"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { LeadDetailsSheet } from "./lead-details-sheet"
import { useState } from "react"

interface KanbanCardProps {
  lead: Lead
  status: LeadStatus
}

export function KanbanCard({ lead, status }: KanbanCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: "lead",
      status,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const timeAgo = formatDistanceToNow(new Date(lead.created_at), {
    addSuffix: true,
    locale: ptBR,
  })

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-white"
        onClick={() => setIsSheetOpen(true)}
      >
        <div className="p-4 space-y-3">
          <div>
            <h4 className="font-semibold text-slate-900">{lead.name}</h4>
            <p className="text-sm text-slate-600">{lead.company}</p>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {lead.role}
            </Badge>
            <span className="text-xs text-slate-500">{timeAgo}</span>
          </div>
        </div>
      </Card>
      <LeadDetailsSheet
        leadId={lead.id}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  )
}

