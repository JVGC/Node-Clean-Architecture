import { AssetNotFoundError } from '../../../domain/errors'
import { type UserModelResponse } from '../../../domain/models/user'
import { type UpdateAssetUseCase } from '../../../domain/usecases/asset/update-asset'
import { notFound, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class UpdateAssetController implements Controller {
  constructor (
    private readonly updateAssetUseCase: UpdateAssetUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponse
      const { id: assetId } = httpRequest.params
      const { description, name, healthLevel, model, owner, status, unitId, imageURL } = httpRequest.body
      const result = await this.updateAssetUseCase.update(assetId, {
        name, description, healthLevel, model, status, unitId, owner, imageURL
      }, loggedUser)
      return ok(result)
    } catch (error: any) {
      if (error instanceof AssetNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
