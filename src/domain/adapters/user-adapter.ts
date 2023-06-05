import { type UserModelResponse, type UserModelResponseWithPassword } from '../models/user'

export const removeUserPasswordAdapter = (user: UserModelResponseWithPassword): UserModelResponse => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    companyName: user.companyName,
    role: user.role,
    companyId: user.companyId
  }
}
