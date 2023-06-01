import { UserNotFoundError } from "../../errors";
import { Encrypter, Hasher } from "../../protocols/criptography";
import { UserRepository } from "../../protocols/repositories/user-repository";

export interface LoginParams{
    email: string;
    password: string;
}
export interface LoginResponse{
    accessToken: string;
}

export class LoginUseCase{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly encrypter: Encrypter,
        private readonly hasher: Hasher
    ){}

    async login(data: LoginParams): Promise<LoginResponse>{
        const user = await this.userRepository.getByEmail(data.email)
        if(!user) throw new UserNotFoundError()

        const isValid = await this.hasher.compare(data.password, user.password!)

        if(!isValid) throw new UserNotFoundError()

        const accessToken = this.encrypter.encrypt(user.id)

        return {
            accessToken: accessToken
        }
    }
}