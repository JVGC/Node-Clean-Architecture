import { GetUserByTokenUseCase } from "../../domain/usecases/auth/get-user-by-token";
import { JWTDecrypter } from "../../infra/criptography/jwt";
import { PrismaUserRepository } from "../../infra/prisma/repositories/prisma-user-repository";
import { AdminMiddleware } from "../../presentation/middlewares/admin-middeware";
import { AuthMiddleware } from "../../presentation/middlewares/auth-middleware";
import { SuperAdminMiddleware } from "../../presentation/middlewares/super-admin-middleware";

export const makeAuthMiddleware = (): AuthMiddleware => {
    const prismaUserRepository = new PrismaUserRepository()
    const decrypter = new JWTDecrypter('secret')
    const getUserByTokenUseCase = new GetUserByTokenUseCase(prismaUserRepository, decrypter)
    return new AuthMiddleware(getUserByTokenUseCase)
}

export const makeAdminMiddleware = (): AdminMiddleware => {
    return new AdminMiddleware()
}

export const makeSuperAdminMiddleware = (): SuperAdminMiddleware => {
    return new SuperAdminMiddleware()
}