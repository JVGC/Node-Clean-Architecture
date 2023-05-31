import { AssetNotFoundError } from "../../../domain/errors"
import { UpdateAssetUseCase } from "../../../domain/usecases/asset/update-asset"
import { notFound, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class UpdateAssetController implements Controller {
  constructor (
    private readonly updateAssetUseCase: UpdateAssetUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id: asset_id } = httpRequest.params
      const { description, name } = httpRequest.body
      const result = await this.updateAssetUseCase.update(asset_id, {
        name, description
      })
      return ok(result)
    } catch (error: any) {
      if(error instanceof AssetNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
