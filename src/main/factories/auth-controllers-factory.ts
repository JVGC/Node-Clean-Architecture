import { LoginUseCase } from "../../domain/usecases/auth/login";
import { BcryptAdapter } from "../../infra/criptography/bcrypt";
import { JWTEncrypter } from "../../infra/criptography/jwt";
import { PrismaUserRepository } from "../../infra/prisma/repositories/prisma-user-repository";
import { LoginController } from "../../presentation/controllers/auth/login";

export const makeLogin = (): LoginController => {
    const salt =12
    const bcryptHasher = new BcryptAdapter(salt)
    const jwtEncrypter = new JWTEncrypter(process.env.JWT_SECRET || '' )
    const userRepository = new PrismaUserRepository()
    const loginUseCase = new LoginUseCase(userRepository, jwtEncrypter, bcryptHasher)
    return new LoginController(loginUseCase)

}