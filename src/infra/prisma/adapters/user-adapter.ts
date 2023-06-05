import { type User } from '@prisma/client'
import { type UserModelResponseWithPassword, UserRoles } from '../../../domain/models/user'

type UserAndCompany = (User & {
  company: {
    name: string
  }
})

export const adaptUser = (user: UserAndCompany): UserModelResponseWithPassword => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    companyName: user.company.name,
    role: UserRoles[user.Role],
    companyId: user.companyId
  }
}
