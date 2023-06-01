import { UnitNotFoundError } from "../../../domain/errors"
import { UserModelResponse } from "../../../domain/models/user"
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
      const loggedUser = httpRequest.loggedUser as UserModelResponse
      const { id: unitId } = httpRequest.params
      const { description, name } = httpRequest.body
      const result = await this.updateUnitUseCase.update(unitId, {
        name, description
      }, loggedUser)
      return ok(result)
    } catch (error: any) {
      if(error instanceof UnitNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
