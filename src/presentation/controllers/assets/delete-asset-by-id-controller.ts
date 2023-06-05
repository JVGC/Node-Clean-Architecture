import { AssetNotFoundError } from '../../../domain/errors'
import { type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type DeleteAssetByIdUseCase } from '../../../domain/usecases/asset/delete-asset'
import { notFound, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class DeleteAssetByIdController implements Controller {
  constructor (
    private readonly deleteAssetById: DeleteAssetByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const { id: assetId } = httpRequest.params
      const result = await this.deleteAssetById.delete(assetId, loggedUser)
      return ok(result)
    } catch (error: any) {
      if (error instanceof AssetNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
