import { UserNotFoundError } from "../../errors";
import { UserRepository } from "../../protocols/repositories/user-repository";

export class DeleteUserByIdUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}
    async delete(user_id: string): Promise<boolean>{
      const wasDeleted = await this.userRepository.deleteById(user_id)
      if(!wasDeleted) throw new UserNotFoundError()
      return wasDeleted
    }
}
