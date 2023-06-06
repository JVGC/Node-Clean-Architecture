import { AccessDeniedError, CompanyNotFoundError, EmailAlreadyInUse } from '../../../domain/errors'
import { type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type CreateUserUseCase } from '../../../domain/usecases/users/create-user'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http-helper'
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
      const result = await this.createUserUseCase.create({
        email, name, password, role, companyId
      }, loggedUser)
      return ok(result)
    } catch (error: any) {
      if (error instanceof EmailAlreadyInUse || error instanceof CompanyNotFoundError) {
        return badRequest(error)
      }
      if (error instanceof AccessDeniedError) {
        return forbidden(error)
      }
      return serverError(error)
    }
  }
}
