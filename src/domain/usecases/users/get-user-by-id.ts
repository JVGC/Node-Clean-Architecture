import { UserModel } from "../../models/user";
import { UserRepository } from "../../protocols/repositories/user-repository";

export class GetUserByIdUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}
    async get(user_id: string): Promise<UserModel>{
      
    }
}
