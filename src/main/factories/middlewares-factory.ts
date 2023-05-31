import { GetUserByTokenUseCase } from "../../domain/usecases/auth/get-user-by-token";
import { JWTDecrypter } from "../../infra/criptography/jwt";
import { AuthMiddleware } from "../../presentation/middlewares/auth-middleware";

export const makeAuthMiddleware = (): AuthMiddleware => {
    const decrypter = new JWTDecrypter('secret')
    const getUserByTokenUseCase = new GetUserByTokenUseCase(decrypter)
    return new AuthMiddleware(getUserByTokenUseCase)
}