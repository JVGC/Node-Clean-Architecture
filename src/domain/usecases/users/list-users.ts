import { UserModelResponse } from "../../models/user";
import { UserRepository } from "../../protocols/repositories/user-repository";

export class ListUsersUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}
    async list(): Promise<UserModelResponse[]>{
        const users = await this.userRepository.getMany()
        return users.map(user => {
            delete user.password
            return user
        })
    }
  }