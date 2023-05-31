import { ListUnitsUseCase } from "../../../domain/usecases/unit/list-units"
import { ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class ListUnitsController implements Controller {
  constructor (
    private readonly listUnitsUseCase: ListUnitsUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.listUnitsUseCase.list()
      return ok(result)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
