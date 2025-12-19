"use client"

import { useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Upload, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Papa from "papaparse"
import * as XLSX from "xlsx"
import { leadSchema } from "@/lib/validations/lead"

export function ImportExportActions() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importMutation = useMutation({
    mutationFn: async (leads: any[]) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const leadsWithUserId = leads.map((lead) => ({
        ...lead,
        user_id: user.id,
        status: lead.status || "new",
      }))

      const { error } = await supabase.from("leads").insert(leadsWithUserId)

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Leads importados com sucesso.",
      })
      queryClient.invalidateQueries({ queryKey: ["leads"] })
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao importar leads",
        variant: "destructive",
      })
    },
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const parsedData = results.data as any[]
          
          // Validate headers
          const requiredHeaders = ["name", "email", "phone", "company", "role", "source"]
          const headers = Object.keys(parsedData[0] || {})
          const missingHeaders = requiredHeaders.filter(
            (h) => !headers.includes(h)
          )

          if (missingHeaders.length > 0) {
            toast({
              title: "Erro",
              description: `Cabeçalhos faltando: ${missingHeaders.join(", ")}`,
              variant: "destructive",
            })
            return
          }

          // Validate each row
          const validLeads = []
          for (const row of parsedData) {
            try {
              leadSchema.parse({
                name: row.name,
                email: row.email,
                phone: row.phone,
                company: row.company,
                role: row.role,
                source: row.source,
                status: row.status || "new",
              })
              validLeads.push(row)
            } catch (error) {
              console.error("Invalid row:", row, error)
            }
          }

          if (validLeads.length === 0) {
            toast({
              title: "Erro",
              description: "Nenhum lead válido encontrado no arquivo",
              variant: "destructive",
            })
            return
          }

          importMutation.mutate(validLeads)
        } catch (error: any) {
          toast({
            title: "Erro",
            description: error.message || "Erro ao processar arquivo",
            variant: "destructive",
          })
        }
      },
      error: (error) => {
        toast({
          title: "Erro",
          description: `Erro ao ler arquivo: ${error.message}`,
          variant: "destructive",
        })
      },
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleExport = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const { data: leads, error } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", user.id as string)

      if (error) throw error

      if (!leads || leads.length === 0) {
        toast({
          title: "Aviso",
          description: "Nenhum lead para exportar",
        })
        return
      }

      // Prepare data for Excel
      const worksheet = XLSX.utils.json_to_sheet(leads)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads")

      // Generate filename with timestamp
      const filename = `leads_${new Date().toISOString().split("T")[0]}.xlsx`

      // Download
      XLSX.writeFile(workbook, filename)

      toast({
        title: "Sucesso!",
        description: "Leads exportados com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao exportar leads",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="csv-upload"
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={importMutation.isPending}
      >
        <Upload className="mr-2 h-4 w-4" />
        Importar CSV
      </Button>
      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Exportar Excel
      </Button>
    </div>
  )
}

