import { z } from 'zod'
import { UserRoles } from '../../../domain/models/user'

export const zodCreateUserObject = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  role: z.nativeEnum(UserRoles),
  companyId: z.string()
})

export const zodUpdateUserObject = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  password: z.string().optional(),
  role: z.nativeEnum(UserRoles).optional()
})
