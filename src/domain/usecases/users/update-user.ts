import { EmailAlreadyInUse, UserNotFoundError } from "../../errors";
import { UserModelResponse, UserRoles } from "../../models/user";
import { UserRepository } from "../../protocols/repositories/user-repository";

// DECISION: User will only be able to update the company if it has role == SUPERADMIN.

export interface UpdateUserParams {
    name?: string;
    email?: string
    password?: string;
    role?: UserRoles
}


export class UpdateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}
    async update(user_id: string, data: UpdateUserParams): Promise<UserModelResponse>{
        if(data.email){
            const isCodeInUse = await this.userRepository.getByEmail(data.email)
            if(isCodeInUse) throw new EmailAlreadyInUse()
        }
        const user = await this.userRepository.update(user_id, data)
        if(!user)  throw new UserNotFoundError()
        return user
    }
}

