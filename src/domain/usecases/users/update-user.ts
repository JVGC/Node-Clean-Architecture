import { UserModel, UserRoles } from "../../models/user";
import { UserRepository } from "../../protocols/repositories/user-repository";

// DECISION: User will only be able to update the company if it has role == SUPERADMIN.

export interface UpdateUserParams {
    name?: string;
    email?: string
    password?: string;
    company_id?: string
    role?: UserRoles
}


export class UpdateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}
    async update(user_id: string, data: UpdateUserParams): Promise<UserModel>{

    }
}

