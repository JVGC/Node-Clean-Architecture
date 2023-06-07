import { z } from 'zod'

export const zodLoginObject = z.strictObject({
  email: z.string().email(),
  password: z.string()
})
