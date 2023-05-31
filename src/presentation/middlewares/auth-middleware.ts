import { GetUserByTokenUseCase } from "../../domain/usecases/auth/get-user-by-token";
import { AccessDeniedError } from "../helpers/errors";
import { forbidden, ok, serverError } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class AuthMiddleware{
    constructor(
        private readonly getUserByToken: GetUserByTokenUseCase
    ){}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
        try{
            const accessToken = httpRequest.headers['Authorization']
            if(!accessToken) return forbidden(new AccessDeniedError())

            const userId = this.getUserByToken.get(accessToken)
            if(!userId) return forbidden(new AccessDeniedError())
            console.log(userId)
            return ok(userId)
        }catch (error: any) {
            return serverError(error)
        }
    }
}