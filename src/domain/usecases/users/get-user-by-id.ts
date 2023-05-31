import { UserNotFoundError } from "../../errors";
import { UserModelResponse } from "../../models/user";
import { UserRepository } from "../../protocols/repositories/user-repository";

export class GetUserByIdUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}
    async get(user_id: string): Promise<UserModelResponse>{
        const user = await this.userRepository.getById(user_id)
        if(!user) throw new UserNotFoundError()
        return user
    }
}
