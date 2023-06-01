import { UnitNotFoundError } from "../../../domain/errors"
import { UserModelResponse } from "../../../domain/models/user"
import { CreateAssetUseCase } from "../../../domain/usecases/asset/create-asset"
import { badRequest, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class CreateAssetController implements Controller {
  constructor (
    private readonly createAssetUseCase: CreateAssetUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponse
      const { name, description, unitId, model, owner } = httpRequest.body
      const result = await this.createAssetUseCase.create({
        name, description, unitId, model, owner
      }, loggedUser)
      return ok(result)
    } catch (error: any) {
      if(error instanceof UnitNotFoundError){
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
