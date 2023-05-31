import { AssetNotFoundError } from "../../../domain/errors"
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
      const { id: asset_id } = httpRequest.params
      const result = await this.deleteAssetById.delete(asset_id)
      return ok(result)
    } catch (error: any) {
      if(error instanceof AssetNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
