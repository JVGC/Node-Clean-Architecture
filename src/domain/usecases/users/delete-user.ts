import { AccessDeniedError, UserNotFoundError } from '../../errors'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../models/user'
import { type UserRepository } from '../../protocols/repositories/user-repository'

export class DeleteUserByIdUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async delete (userId: string, loggedUser: UserModelResponseWithoutPassword): Promise<boolean> {
    const user = await this.userRepository.getById(userId)
    if (!user) throw new UserNotFoundError()
    if (loggedUser.role === UserRoles.Admin && loggedUser.companyId !== user.companyId) {
      throw new UserNotFoundError()
    }
    if (loggedUser.role === UserRoles.Admin && user.role === UserRoles.SuperAdmin) {
      throw new AccessDeniedError()
    }
    if (loggedUser.id === user.id) {
      throw new AccessDeniedError()
    }

    return await this.userRepository.deleteById(userId)
  }
}
