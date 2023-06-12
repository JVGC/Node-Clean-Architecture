import { AccessDeniedError } from '../../domain/errors'
import { type UserModel, UserRoles } from '../../domain/models/user'
import { forbidden, ok, serverError } from '../helpers/http-helper'
import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { type PermissionMiddleware } from '../protocols/permission-middleware'

export class AdminMiddleware implements PermissionMiddleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModel
      if (loggedUser.role === UserRoles.Admin || loggedUser.role === UserRoles.SuperAdmin) { return ok({ loggedUser }) }
      return forbidden(new AccessDeniedError())
    } catch (error: any) {
      return serverError(error)
    }
  }
}
