import { LoginUseCase } from "../../domain/usecases/auth/login";
import { JWTEncrypter } from "../../infra/criptography/jwt";
import { PrismaUserRepository } from "../../infra/prisma/repositories/prisma-user-repository";
import { LoginController } from "../../presentation/controllers/auth/login";

export const makeLogin = (): LoginController => {
    // TODO: Criar uma env para o secret
    const jwtEncrypter = new JWTEncrypter('secret')
    const userRepository = new PrismaUserRepository()
    const loginUseCase = new LoginUseCase(userRepository, jwtEncrypter)
    return new LoginController(loginUseCase)

}