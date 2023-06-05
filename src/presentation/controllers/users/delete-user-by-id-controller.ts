import { UserNotFoundError } from '../../../domain/errors'
import { type DeleteUserByIdUseCase } from '../../../domain/usecases/users/delete-user'
import { notFound, ok, serverError } from '../../helpers/http-helper'
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
      const result = await this.deleteUserById.delete(userId, loggedUser)
      return ok(result)
    } catch (error: any) {
      if (error instanceof UserNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
