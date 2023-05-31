import { ListAssetsUseCase } from "../../../domain/usecases/asset/list-assets"
import { ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class ListAssetsController implements Controller {
  constructor (
    private readonly listAssetsUseCase: ListAssetsUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.listAssetsUseCase.list()
      return ok(result)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
