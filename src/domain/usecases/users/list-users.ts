import { UserModelResponse, UserModelResponseWithPassword } from "../../models/user";
import { UserRepository } from "../../protocols/repositories/user-repository";

export class ListUsersUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}
    async list(companyId?: string): Promise<UserModelResponse[]>{
        let users: UserModelResponseWithPassword[]
        if(companyId)
            users = await this.userRepository.getMany(companyId)
        else
            users = await this.userRepository.getMany()

        return users.map(user => {
            delete user.password
            return user
        })
    }
  }