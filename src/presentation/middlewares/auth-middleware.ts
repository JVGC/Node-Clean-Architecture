import { GetUserByTokenUseCase } from "../../domain/usecases/auth/get-user-by-token";
import { ok, serverError, unauthorized } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class AuthMiddleware{
    constructor(
        private readonly getUserByToken: GetUserByTokenUseCase
    ){}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
        try{
            const accessToken = httpRequest.headers['authorization']
            if(!accessToken) return unauthorized()

            const user = await this.getUserByToken.get(accessToken)
            if(!user) return unauthorized()
            return ok(user)
        }catch (error: any) {
            return serverError(error)
        }
    }
}