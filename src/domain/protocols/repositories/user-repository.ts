import { type UserModelResponse } from '../../models/user'
import { type CreateUserParams } from '../../usecases/users/create-user'
import { type UpdateUserParams } from '../../usecases/users/update-user'

export interface UserRepository {
  create: (data: CreateUserParams) => Promise<UserModelResponse>
  getById: (id: string) => Promise<UserModelResponse | null>
  getByEmail: (email: string) => Promise<UserModelResponse | null>
  getMany: (companyId?: string) => Promise<UserModelResponse[]>
  deleteById: (id: string) => Promise<boolean>
  update: (id: string, updateData: UpdateUserParams) => Promise<UserModelResponse | null>
}
