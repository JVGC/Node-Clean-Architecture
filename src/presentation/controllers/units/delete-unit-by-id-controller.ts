import { UnitNotFoundError } from "../../../domain/errors"
import { UserModelResponse } from "../../../domain/models/user"
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
      const loggedUser = httpRequest.loggedUser as UserModelResponse
      const { id: unitId } = httpRequest.params
      const result = await this.deleteUnitById.delete(unitId, loggedUser)
      return ok(result)
    } catch (error: any) {
      if(error instanceof UnitNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
