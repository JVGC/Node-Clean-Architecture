import { EmailAlreadyInUse, UserNotFoundError } from '../../errors'
import { type UserModelResponse, type UserRoles } from '../../models/user'
import { type UserRepository } from '../../protocols/repositories/user-repository'

// DECISION: User will only be able to update the company if it has role == SUPERADMIN.

export interface UpdateUserParams {
  name?: string
  email?: string
  password?: string
  role?: UserRoles
}

export class UpdateUserUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async update (userId: string, data: UpdateUserParams): Promise<UserModelResponse> {
    if (data.email) {
      const isCodeInUse = await this.userRepository.getByEmail(data.email)
      if (isCodeInUse) throw new EmailAlreadyInUse()
    }
    const user = await this.userRepository.update(userId, data)
    if (!user) throw new UserNotFoundError()
    delete user.password
    return user
  }
}
