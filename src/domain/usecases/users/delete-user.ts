import { UserRepository } from "../../protocols/repositories/user-repository";

export class DeleteUserByIdUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}
    async delete(user_id: string): Promise<boolean>{
      return true
    }
}
