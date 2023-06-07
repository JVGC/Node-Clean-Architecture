import { z } from 'zod'

export const zodLoginObject = z.object({
  email: z.string().email(),
  password: z.string()
})
