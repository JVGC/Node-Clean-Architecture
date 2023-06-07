import { z } from 'zod'

export const zodCreateUnitObject = z.object({
  name: z.string(),
  description: z.string(),
  companyId: z.string()
})

export const zodUpdateUnitObject = z.object({
  name: z.string().optional(),
  description: z.string().optional()
})
