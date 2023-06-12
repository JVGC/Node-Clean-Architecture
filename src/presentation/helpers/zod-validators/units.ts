import { z } from 'zod'

export const zodCreateUnitObject = z.strictObject({
  name: z.string(),
  description: z.string(),
  companyId: z.string()
})

export const zodUpdateUnitObject = z.strictObject({
  name: z.string().optional(),
  description: z.string().optional()
})
