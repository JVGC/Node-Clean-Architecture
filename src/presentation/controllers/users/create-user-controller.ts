import { CompanyNotFoundError, EmailAlreadyInUse } from '../../../domain/errors'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type CreateUserUseCase } from '../../../domain/usecases/users/create-user'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class CreateUserController implements Controller {
  constructor (
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const { email, name, password, role, companyId } = httpRequest.body
      let result: UserModelResponseWithoutPassword

      if (loggedUser.role !== UserRoles.SuperAdmin) {
        result = await this.createUserUseCase.create({
          email, name, password, role, companyId: loggedUser.companyId
        })
      } else {
        result = await this.createUserUseCase.create({
          email, name, password, role, companyId
        })
      }
      return ok(result)
    } catch (error: any) {
      if (error instanceof EmailAlreadyInUse) {
        return badRequest(error)
      }
      if (error instanceof CompanyNotFoundError) {
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
