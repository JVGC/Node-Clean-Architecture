import { UserNotFoundError } from '../../../domain/errors'
import { type LoginUseCase } from '../../../domain/usecases/auth/login'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { type Validator } from '../../protocols/validator'

export class LoginController implements Controller {
  constructor (
    private readonly loginUseCase: LoginUseCase,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requestErrors = await this.validator.validate(httpRequest.body)
      if (requestErrors) {
        return badRequest(requestErrors)
      }
      const { email, password } = httpRequest.body
      const result = await this.loginUseCase.login({ email, password })
      return ok(result)
    } catch (error: any) {
      if (error instanceof UserNotFoundError) return badRequest(error)
      return serverError(error)
    }
  }
}
