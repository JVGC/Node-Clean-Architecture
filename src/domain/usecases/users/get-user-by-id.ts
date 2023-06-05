import { UserNotFoundError } from '../../errors'
import { type UserModelResponse } from '../../models/user'
import { type UserRepository } from '../../protocols/repositories/user-repository'

export class GetUserByIdUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async get (userId: string): Promise<UserModelResponse> {
    const user = await this.userRepository.getById(userId)
    if (!user) throw new UserNotFoundError()
    delete user.password
    return user
  }
}
