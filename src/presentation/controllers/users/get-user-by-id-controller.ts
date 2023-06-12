import { UserNotFoundError } from '../../../domain/errors'
import { type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type GetUserByIdUseCase } from '../../../domain/usecases/users/get-user-by-id'
import { notFound, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class GetUserByIdController implements Controller {
  constructor (
    private readonly getUserById: GetUserByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const { id: userId } = httpRequest.params
      const result = await this.getUserById.get(userId, loggedUser)
      return ok(result)
    } catch (error: any) {
      if (error instanceof UserNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
