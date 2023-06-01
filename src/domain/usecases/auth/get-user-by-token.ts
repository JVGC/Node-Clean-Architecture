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
            const userId = this.decrypter.decrypt(token)
            if(!userId) return null
            const user = await this.userRepository.getById(userId)
            return user
        }catch(error: any){
            return null
        }
    }
}
