import { type UserModelResponse, type UserModelResponseWithoutPassword } from '../models/user'

export const removeUserPasswordAdapter = (user: UserModelResponse): UserModelResponseWithoutPassword => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    companyName: user.companyName,
    role: user.role,
    companyId: user.companyId
  }
}
