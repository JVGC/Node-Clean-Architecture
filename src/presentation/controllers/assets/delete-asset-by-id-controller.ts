import { AssetNotFoundError } from "../../../domain/errors"
import { UserModelResponse } from "../../../domain/models/user"
import { DeleteAssetByIdUseCase } from "../../../domain/usecases/asset/delete-asset"
import { notFound, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class DeleteAssetByIdController implements Controller {
  constructor (
    private readonly deleteAssetById: DeleteAssetByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponse
      const { id: assetId } = httpRequest.params
      const result = await this.deleteAssetById.delete(assetId, loggedUser)
      return ok(result)
    } catch (error: any) {
      if(error instanceof AssetNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
