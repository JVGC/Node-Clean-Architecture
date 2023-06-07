import { z } from 'zod'

export const zodCreateCompanyObject = z.object({
  name: z.string(),
  code: z.string()
})

export const zodUpdateCompanyObject = z.object({
  name: z.string().optional(),
  code: z.string().optional()
})
