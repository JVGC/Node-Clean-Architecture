import { removeUserPasswordAdapter } from '../../adapters/user-adapter'
import { AccessDeniedError, EmailAlreadyInUse, UserNotFoundError } from '../../errors'
import { UserRoles, type UserModelResponse, type UserModelResponseWithoutPassword } from '../../models/user'
import { type Hasher } from '../../protocols/criptography'
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
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher
  ) {}

  private async updateUser (userId: string, data: UpdateUserParams): Promise<UserModelResponseWithoutPassword> {
    if (data.email) {
      const userWithEmail = await this.userRepository.getByEmail(data.email)
      if (userWithEmail && userWithEmail.id !== userId) throw new EmailAlreadyInUse()
    }
    let updatedUser: UserModelResponse | null
    if (data.password) {
      updatedUser = await this.userRepository.update(userId, { ...data, password: (await this.hasher.hash(data.password)) })
    } else {
      updatedUser = await this.userRepository.update(userId, data)
    }
    if (!updatedUser) throw new UserNotFoundError()
    return removeUserPasswordAdapter(updatedUser)
  }

  async update (userId: string, data: UpdateUserParams, loggedUser: UserModelResponseWithoutPassword): Promise<UserModelResponseWithoutPassword> {
    if (loggedUser.id === userId) {
      if (data.role && data.role !== loggedUser.role) {
        throw new AccessDeniedError()
      }
      return this.updateUser(userId, data)
    }
    if (data.password) {
      throw new AccessDeniedError()
    }
    if (loggedUser.role === UserRoles.User) {
      throw new AccessDeniedError()
    }

    const user = await this.userRepository.getById(userId)
    if (!user) throw new UserNotFoundError()
    if (loggedUser.role === UserRoles.Admin) {
      if (loggedUser.companyId !== user.companyId) {
        throw new UserNotFoundError()
      } else if (user.role === UserRoles.SuperAdmin) {
        throw new AccessDeniedError()
      }
      if (data.role === UserRoles.SuperAdmin) {
        throw new AccessDeniedError()
      }
    }

    return this.updateUser(userId, data)
  }
}
