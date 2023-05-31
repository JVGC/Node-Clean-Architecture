import { UserNotFoundError } from "../../../domain/errors"
import { UpdateUserUseCase } from "../../../domain/usecases/users/update-user"
import { notFound, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class UpdateUserController implements Controller {
  constructor (
    private readonly updateUserUseCase: UpdateUserUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id: user_id } = httpRequest.params
      const { name, code } = httpRequest.body
      const result = await this.updateUserUseCase.update(user_id, {
        name,
        code
      })
      return ok(result)
    } catch (error: any) {
      if(error instanceof UserNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
