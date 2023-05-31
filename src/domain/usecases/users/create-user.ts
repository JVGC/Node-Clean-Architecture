import { UserModel, UserRoles } from "../../models/user";
import { UserRepository } from "../../protocols/repositories/user-repository";

export interface CreateUserParams {
    name: string;
    email: string
    password: string;
    passwordConfirmation: string;
    company_id: string;
    role: UserRoles
}

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}
    async create(data: CreateUserParams): Promise<UserModel>{
        
    }
}
