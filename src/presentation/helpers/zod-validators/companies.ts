import { z } from 'zod'

export const zodCreateCompanyObject = z.strictObject({
  name: z.string(),
  code: z.string()
})

export const zodUpdateCompanyObject = z.strictObject({
  name: z.string().optional(),
  code: z.string().optional()
})
