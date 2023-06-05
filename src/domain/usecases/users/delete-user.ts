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
    if (loggedUser.role === UserRoles.Admin && user.role === UserRoles.User && loggedUser.companyId === user.companyId) { return await this.userRepository.deleteById(userId) }

    throw new AccessDeniedError()
  }
}
