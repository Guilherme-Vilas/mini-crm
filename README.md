# Mini CRM

Sistema de gerenciamento de leads desenvolvido com Next.js 14+, TypeScript, Supabase e TanStack Query.

## 🚀 Stack Tecnológica

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Icons:** Lucide React
- **Backend/Auth:** Supabase (Auth com RLS + Database)
- **State/Async:** TanStack Query (v5) para cache e atualizações otimistas
- **Drag & Drop:** @dnd-kit/core + @dnd-kit/sortable
- **Forms:** React Hook Form + Zod (Validação estrita)
- **Utils:** papaparse (CSV Import), xlsx (Excel Export), date-fns

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório e instale as dependências:**

```bash
npm install
```

2. **Configure as variáveis de ambiente:**

Copie o arquivo `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Edite o `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

3. **Configure o banco de dados no Supabase:**

Execute os seguintes SQL no SQL Editor do Supabase:

```sql
-- Criar tabela de leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'negotiation', 'closed', 'lost')),
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de interações
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para leads
CREATE POLICY "Users can view their own leads"
  ON leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leads"
  ON leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads"
  ON leads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads"
  ON leads FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para interactions
CREATE POLICY "Users can view interactions of their leads"
  ON interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = interactions.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert interactions for their leads"
  ON interactions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = interactions.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update interactions of their leads"
  ON interactions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = interactions.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete interactions of their leads"
  ON interactions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = interactions.lead_id
      AND leads.user_id = auth.uid()
    )
  );
```

4. **Execute o projeto:**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## ✨ Funcionalidades

- ✅ **Autenticação:** Login e registro com Supabase Auth
- ✅ **Kanban Board:** Pipeline visual com drag & drop entre colunas
- ✅ **UI Otimista:** Atualizações instantâneas com rollback automático em caso de erro
- ✅ **Criação de Leads:** Modal com validação completa e máscara de telefone
- ✅ **Detalhes do Lead:** Sheet lateral com informações e histórico de interações
- ✅ **Timeline de Interações:** Visualização cronológica de todas as interações
- ✅ **Adicionar Interações:** Formulário para registrar ligações, emails, reuniões e notas
- ✅ **Importação CSV:** Validação de cabeçalhos e importação em lote
- ✅ **Exportação Excel:** Download de todos os leads filtrados
- ✅ **Design Responsivo:** Funciona perfeitamente em mobile e desktop
- ✅ **Proteção de Rotas:** Middleware protegendo rotas autenticadas

## 📱 Responsividade

O Kanban Board se adapta automaticamente:
- **Desktop:** Colunas horizontais com scroll horizontal
- **Mobile:** Scroll horizontal com snap para melhor UX

## 🎨 Design

- Tema "Modern SaaS" com cores Indigo/Violet
- Background `bg-slate-50`
- Cards brancos com sombras sutis
- Feedback visual com toasts (Sonner)

## 📦 Estrutura do Projeto

```
src/
  app/                    # Rotas Next.js (App Router)
    auth/                 # Páginas de autenticação
    dashboard/            # Dashboard principal
  components/
    ui/                   # Componentes Shadcn/UI
    crm/                  # Componentes específicos do CRM
    dashboard/            # Componentes do dashboard
  lib/
    supabase/            # Clientes Supabase
    validations/          # Schemas Zod
    utils.ts              # Utilitários
  types/                  # Tipos TypeScript
  hooks/                  # Custom hooks
  middleware.ts           # Middleware de autenticação
```

## 🚢 Deploy

O projeto está pronto para deploy na Vercel:

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático!

## 📝 Notas

- O sistema usa **RLS (Row Level Security)** do Supabase para garantir que cada usuário só veja seus próprios leads
- Todas as validações são feitas com **Zod** tanto no frontend quanto no backend
- O drag & drop é otimizado para mobile com ativação por toque

## 🤝 Contribuindo

Este é um projeto de teste técnico. Sinta-se livre para sugerir melhorias!

## 📄 Licença

MIT

