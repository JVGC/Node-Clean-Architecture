import { AccessDeniedError, UserNotFoundError } from '../../../domain/errors'
import { type DeleteUserByIdUseCase } from '../../../domain/usecases/users/delete-user'
import { forbidden, noContent, notFound, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class DeleteUserByIdController implements Controller {
  constructor (
    private readonly deleteUserById: DeleteUserByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser
      const { id: userId } = httpRequest.params
      await this.deleteUserById.delete(userId, loggedUser)
      return noContent()
    } catch (error: any) {
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
