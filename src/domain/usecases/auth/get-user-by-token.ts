import { UserModelResponse } from "../../models/user";
import { Decrypter } from "../../protocols/criptography";
import { UserRepository } from "../../protocols/repositories/user-repository";

export class GetUserByTokenUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly decrypter: Decrypter
    ){}
    async get(token: string): Promise<UserModelResponse | null>{
        try{
            const accessToken = token.split('Bearer ')[1]
            const userId = this.decrypter.decrypt(accessToken)
            if(!userId) return null
            const user = await this.userRepository.getById(userId)
            if(!user) return null
            delete user.password
            return user
        }catch(error: any){
            return null
        }
    }
}
