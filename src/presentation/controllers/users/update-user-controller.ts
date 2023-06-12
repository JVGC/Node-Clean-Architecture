import { AccessDeniedError, EmailAlreadyInUse, UserNotFoundError } from '../../../domain/errors'
import { type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type UpdateUserUseCase } from '../../../domain/usecases/users/update-user'
import { badRequest, forbidden, notFound, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { type Validator } from '../../protocols/validator'

export class UpdateUserController implements Controller {
  constructor (
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requestErrors = await this.validator.validate(httpRequest.body)
      if (requestErrors) {
        return badRequest(requestErrors)
      }
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const { id: userId } = httpRequest.params
      const { email, name, password, role } = httpRequest.body
      const result = await this.updateUserUseCase.update(userId, {
        email, name, password, role
      }, loggedUser)
      return ok(result)
    } catch (error: any) {
      if (error instanceof EmailAlreadyInUse) {
        return badRequest(error)
      }
      if (error instanceof UserNotFoundError) {
        return notFound(error)
      }
      if (error instanceof AccessDeniedError) {
        return forbidden(error)
      }
      return serverError(error)
    }
  }
}
