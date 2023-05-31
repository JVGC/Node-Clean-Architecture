import { UnitNotFoundError } from "../../../domain/errors"
import { UpdateUnitUseCase } from "../../../domain/usecases/unit/update-unit"
import { notFound, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class UpdateUnitController implements Controller {
  constructor (
    private readonly updateUnitUseCase: UpdateUnitUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id: unit_id } = httpRequest.params
      const { description, name } = httpRequest.body
      const result = await this.updateUnitUseCase.update(unit_id, {
        name, description
      })
      return ok(result)
    } catch (error: any) {
      if(error instanceof UnitNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
