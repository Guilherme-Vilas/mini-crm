# 🚀 Deploy para GitHub e Vercel

## 📦 Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `mini-crm` (ou o nome que preferir)
   - **Description:** Mini CRM com Next.js 14, Supabase e Kanban Board
   - **Visibility:** Public ou Private (sua escolha)
   - **NÃO marque** "Add a README file" (já temos um)
3. Clique em **Create repository**

## 🔗 Passo 2: Conectar ao GitHub

Execute os comandos abaixo (substitua `SEU_USUARIO` pelo seu username do GitHub):

```bash
# Adicionar o remote do GitHub
git remote add origin https://github.com/SEU_USUARIO/mini-crm.git

# Ou se preferir SSH:
# git remote add origin git@github.com:SEU_USUARIO/mini-crm.git

# Fazer push para o GitHub
git push -u origin main
```

**Se der erro de autenticação**, você pode:
- Usar GitHub CLI: `gh auth login`
- Ou configurar SSH key
- Ou usar Personal Access Token

## ☁️ Passo 3: Deploy na Vercel

### Opção A: Via Interface Web (Recomendado)

1. Acesse: https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em **Add New Project**
4. Selecione o repositório `mini-crm`
5. Configure o projeto:
   - **Framework Preset:** Next.js (já detectado automaticamente)
   - **Root Directory:** `./` (padrão)
   - **Build Command:** `npm run build` (padrão)
   - **Output Directory:** `.next` (padrão)
6. **IMPORTANTE:** Adicione as variáveis de ambiente:
   - Clique em **Environment Variables**
   - Adicione:
     ```
     NEXT_PUBLIC_SUPABASE_URL = sua_url_do_supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY = sua_chave_anonima
     ```
7. Clique em **Deploy**

### Opção B: Via Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Seguir as instruções interativas
# Quando perguntar sobre variáveis de ambiente, adicione:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## ✅ Passo 4: Configurar Banco de Dados no Supabase

⚠️ **IMPORTANTE:** Antes de usar a aplicação, você precisa:

1. Executar o SQL no Supabase (veja `README.md`)
2. Configurar as políticas RLS (Row Level Security)

## 🔧 Passo 5: Verificar Deploy

Após o deploy, a Vercel vai fornecer uma URL como:
```
https://mini-crm.vercel.app
```

Acesse e verifique se tudo está funcionando!

## 📝 Notas Importantes

- ✅ O arquivo `.env.local` **NÃO** vai para o GitHub (está no .gitignore)
- ✅ As variáveis de ambiente devem ser configuradas na Vercel
- ✅ Cada ambiente (desenvolvimento, produção) precisa das mesmas variáveis
- ✅ Após cada push para `main`, a Vercel faz deploy automático

## 🐛 Troubleshooting

### Erro: "Invalid supabaseUrl"
- Verifique se as variáveis de ambiente estão configuradas na Vercel
- Certifique-se de que não há espaços extras nos valores

### Erro: "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
- Verifique se adicionou a variável na Vercel
- Certifique-se de usar a chave **anon public**, não a service_role

### Build falha na Vercel
- Verifique os logs de build na Vercel
- Certifique-se de que todas as dependências estão no `package.json`

## 🎉 Pronto!

Seu Mini CRM está no ar! 🚀

