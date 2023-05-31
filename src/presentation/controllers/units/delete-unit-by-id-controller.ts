import { UnitNotFoundError } from "../../../domain/errors"
import { DeleteUnitByIdUseCase } from "../../../domain/usecases/unit/delete-unit"
import { notFound, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class DeleteUnitByIdController implements Controller {
  constructor (
    private readonly deleteUnitById: DeleteUnitByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id: unit_id } = httpRequest.params
      const result = await this.deleteUnitById.delete(unit_id)
      return ok(result)
    } catch (error: any) {
      if(error instanceof UnitNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
