import { AssetNotFoundError } from "../../../domain/errors"
import { GetAssetByIdUseCase } from "../../../domain/usecases/asset/get-asset-by-id"
import { notFound, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class GetAssetByIdController implements Controller {
  constructor (
    private readonly getAssetById: GetAssetByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser
      const { id: assetId } = httpRequest.params
      const result = await this.getAssetById.get(assetId, loggedUser)
      return ok(result)
    } catch (error: any) {
      if(error instanceof AssetNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
