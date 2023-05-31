import { UserNotFoundError } from "../../../domain/errors"
import { GetUserByIdUseCase } from "../../../domain/usecases/users/get-user-by-id"
import { notFound, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class GetUserByIdController implements Controller {
  constructor (
    private readonly getUserById: GetUserByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id: user_id } = httpRequest.params
      const result = await this.getUserById.get(user_id)
      return ok(result)
    } catch (error: any) {
      if(error instanceof UserNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
