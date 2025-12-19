"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function SetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl font-bold">Configuração Necessária</CardTitle>
          </div>
          <CardDescription>
            Configure suas credenciais do Supabase para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-100 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Passos para configurar:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Acesse o painel do Supabase:{" "}
                <a
                  href="https://app.supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://app.supabase.com
                </a>
              </li>
              <li>Crie um novo projeto ou use um existente</li>
              <li>Vá em <strong>Settings → API</strong></li>
              <li>Copie a <strong>Project URL</strong></li>
              <li>Copie a <strong>anon/public key</strong></li>
              <li>
                Abra o arquivo <code className="bg-white px-1 rounded">.env.local</code> na raiz do projeto
              </li>
              <li>
                Substitua <code className="bg-white px-1 rounded">your_supabase_project_url</code> pela URL copiada
              </li>
              <li>
                Substitua <code className="bg-white px-1 rounded">your_supabase_anon_key</code> pela chave copiada
              </li>
              <li>Salve o arquivo e reinicie o servidor (Ctrl+C e depois npm run dev)</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Exemplo do .env.local:</h4>
            <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
            </pre>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">⚠️ Importante:</h4>
            <p className="text-sm text-blue-800">
              Após configurar o Supabase, você também precisará executar o SQL do banco de dados.
              Consulte o arquivo <code className="bg-white px-1 rounded">README.md</code> para ver os comandos SQL necessários.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

