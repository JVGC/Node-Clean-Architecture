import { GetUserByTokenUseCase } from "../../domain/usecases/auth/get-user-by-token";
import { JWTDecrypter } from "../../infra/criptography/jwt";
import { PrismaUserRepository } from "../../infra/prisma/repositories/prisma-user-repository";
import { AuthMiddleware } from "../../presentation/middlewares/auth-middleware";

export const makeAuthMiddleware = (): AuthMiddleware => {
    const prismaUserRepository = new PrismaUserRepository()
    const decrypter = new JWTDecrypter('secret')
    const getUserByTokenUseCase = new GetUserByTokenUseCase(prismaUserRepository, decrypter)
    return new AuthMiddleware(getUserByTokenUseCase)
}