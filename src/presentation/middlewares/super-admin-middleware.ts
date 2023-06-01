import { UserModel, UserRoles } from "../../domain/models/user";
import { AccessDeniedError } from "../helpers/errors";
import { forbidden, ok, serverError } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { PermissionMiddleware } from "../protocols/permission-middleware";

export class SuperAdminMiddleware implements PermissionMiddleware{
    async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
        try{
            const loggedUser = httpRequest.loggedUser as UserModel
            if(loggedUser.role === UserRoles.SuperAdmin)
                return ok({loggedUser})
            return forbidden(new AccessDeniedError())
        }catch (error: any) {
            return serverError(error)
        }
    }
}