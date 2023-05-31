import { Decrypter } from "../../protocols/criptography";

export class GetUserByTokenUseCase {
    constructor(
        private readonly decrypter: Decrypter
    ){}
    async get(token: string): Promise<string | null>{
        try{
            const user = this.decrypter.decrypt(token)
            return user
        }catch(error: any){
            return null
        }
    }
}
