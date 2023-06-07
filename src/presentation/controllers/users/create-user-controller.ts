import { AccessDeniedError, CompanyNotFoundError, EmailAlreadyInUse } from '../../../domain/errors'
import { type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type CreateUserUseCase } from '../../../domain/usecases/users/create-user'
import { badRequest, created, forbidden, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { type Validator } from '../../protocols/validator'

export class CreateUserController implements Controller {
  constructor (
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requestErrors = await this.validator.validate(httpRequest.body)
      if (requestErrors) {
        return badRequest(requestErrors)
      }
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const { email, name, password, role, companyId } = httpRequest.body
      const result = await this.createUserUseCase.create({
        email, name, password, role, companyId
      }, loggedUser)
      return created(result)
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
