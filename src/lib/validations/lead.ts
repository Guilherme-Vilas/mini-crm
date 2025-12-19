import { z } from 'zod'

export const leadStatusSchema = z.enum(['new', 'contacted', 'negotiation', 'closed', 'lost'])

export const leadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  company: z.string().min(1, 'Empresa é obrigatória'),
  role: z.string().min(1, 'Cargo é obrigatório'),
  status: leadStatusSchema.default('new'),
  source: z.string().min(1, 'Origem é obrigatória'),
})

export const leadUpdateSchema = leadSchema.partial().extend({
  id: z.string().uuid(),
})

export type LeadFormData = z.infer<typeof leadSchema>
export type LeadUpdateData = z.infer<typeof leadUpdateSchema>

