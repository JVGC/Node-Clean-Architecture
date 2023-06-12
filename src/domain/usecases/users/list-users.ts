import { removeUserPasswordAdapter } from '../../adapters/user-adapter'
import { type UserModelResponse, type UserModelResponseWithoutPassword } from '../../models/user'
import { type UserRepository } from '../../protocols/repositories/user-repository'

export class ListUsersUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async list (companyId?: string): Promise<UserModelResponseWithoutPassword[]> {
    let users: UserModelResponse[]
    if (companyId) {
      users = await this.userRepository.getMany(companyId)
    } else {
      users = await this.userRepository.getMany()
    }

    return users.map(user => removeUserPasswordAdapter(user))
  }
}
