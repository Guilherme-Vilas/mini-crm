"use client"

import { KanbanBoard } from "@/components/crm/kanban-board"
import { NewLeadDialog } from "@/components/crm/new-lead-dialog"
import { ImportExportActions } from "@/components/crm/import-export-actions"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

export default function DashboardPage() {
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pipeline de Leads</h1>
          <p className="text-slate-600 mt-1">
            Gerencie seus leads em um pipeline visual
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ImportExportActions />
          <Button onClick={() => setIsNewLeadOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        </div>
      </div>
      <KanbanBoard />
      <NewLeadDialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen} />
    </div>
  )
}

