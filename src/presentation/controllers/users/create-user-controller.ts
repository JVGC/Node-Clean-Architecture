import { CreateUserUseCase } from "../../../domain/usecases/users/create-user"
import { ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class CreateUserController implements Controller {
  constructor (
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, code } = httpRequest.body
      const result = await this.createUserUseCase.create({
        name,
        code
      })
      return ok(result)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
