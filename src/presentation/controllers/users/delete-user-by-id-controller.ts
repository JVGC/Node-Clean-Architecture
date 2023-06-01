import { UserNotFoundError } from "../../../domain/errors"
import { DeleteUserByIdUseCase } from "../../../domain/usecases/users/delete-user"
import { notFound, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

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
      if(error instanceof UserNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
