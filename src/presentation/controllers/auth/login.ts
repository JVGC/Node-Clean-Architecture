import { UserNotFoundError } from '../../../domain/errors'
import { type LoginUseCase } from '../../../domain/usecases/auth/login'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class LoginController implements Controller {
  constructor (private readonly loginUseCase: LoginUseCase) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    try {
      const result = await this.loginUseCase.login({ email, password })
      return ok(result)
    } catch (error: any) {
      if (error instanceof UserNotFoundError) return badRequest(error)
      return serverError(error)
    }
  }
}
