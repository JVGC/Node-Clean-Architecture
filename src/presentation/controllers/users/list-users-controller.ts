import { ListUsersUseCase } from "../../../domain/usecases/users/list-users"
import { ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class ListUsersController implements Controller {
  constructor (
    private readonly listUsersUseCase: ListUsersUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.listUsersUseCase.list()
      return ok(result)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
