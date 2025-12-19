# 🔐 Configuração do Supabase - Guia Completo

## ✅ Credenciais Necessárias (APENAS 2)

Para este projeto, você precisa de **APENAS** estas 2 credenciais:

1. **NEXT_PUBLIC_SUPABASE_URL** - A URL do seu projeto
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - A chave anônima (anon/public key)

## ❌ NÃO Precisa

- ❌ **Service Role Key** - Não é necessária para este projeto
- ❌ **JWT Secret** - Não é necessária
- ❌ **Database Password** - Não é necessária

## 📍 Onde Encontrar no Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** (ícone de engrenagem no menu lateral)
4. Clique em **API**
5. Na seção **Project API keys**, você verá:

### 🔑 Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```
Copie esta URL → vai no `.env.local` como `NEXT_PUBLIC_SUPABASE_URL`

### 🔑 anon public
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU5ODQwMCwiZXhwIjoxOTU4MTc0NDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Copie esta chave → vai no `.env.local` como `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ⚠️ Importante sobre Service Role Key

A **Service Role Key** (também chamada de `service_role` ou `secret`) **NÃO é necessária** para este projeto porque:

1. ✅ Estamos usando **RLS (Row Level Security)** no Supabase
2. ✅ A **anon key** é suficiente para operações autenticadas
3. ✅ O RLS garante que cada usuário só acessa seus próprios dados
4. ✅ A service_role_key só seria necessária para **bypassar o RLS**, o que não precisamos

## 📝 Exemplo do .env.local Correto

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU5ODQwMCwiZXhwIjoxOTU4MTc0NDAwfQ.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

## 🔍 Verificação

Após configurar, verifique se:

1. ✅ A URL começa com `https://`
2. ✅ A URL termina com `.supabase.co`
3. ✅ A anon key é uma string longa (começa com `eyJ...`)
4. ✅ Não há espaços extras antes ou depois dos valores
5. ✅ Não há aspas ao redor dos valores

## 🚨 Erros Comuns

### "Invalid supabaseUrl"
- Verifique se a URL está completa (começa com `https://`)
- Não coloque aspas ao redor do valor
- Não deixe espaços extras

### "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
- Verifique se copiou a chave completa (é muito longa)
- Certifique-se de que é a chave **anon public**, não a service_role
- Não coloque aspas ao redor do valor

## 🎯 Próximo Passo

Depois de configurar o `.env.local`, você também precisa:

1. ✅ Executar o SQL do banco de dados (veja README.md)
2. ✅ Reiniciar o servidor (`npm run dev`)

