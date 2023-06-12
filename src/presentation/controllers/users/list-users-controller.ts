import { UserRoles, type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type ListUsersUseCase } from '../../../domain/usecases/users/list-users'
import { ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class ListUsersController implements Controller {
  constructor (
    private readonly listUsersUseCase: ListUsersUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      let result
      if (loggedUser.role !== UserRoles.SuperAdmin) {
        result = await this.listUsersUseCase.list(loggedUser.companyId)
      } else {
        result = await this.listUsersUseCase.list()
      }
      return ok(result)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
