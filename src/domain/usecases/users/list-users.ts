import { UserModel } from "../../models/user";
import { UserRepository } from "../../protocols/repositories/user-repository";

export class ListUsersUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}
    async list(): Promise<UserModel[]>{
        
    }
  }