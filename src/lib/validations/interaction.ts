import { z } from 'zod'

export const interactionTypeSchema = z.enum(['call', 'email', 'meeting', 'note'])

export const interactionSchema = z.object({
  lead_id: z.string().uuid(),
  type: interactionTypeSchema,
  content: z.string().min(1, 'Conteúdo é obrigatório'),
})

export type InteractionFormData = z.infer<typeof interactionSchema>

