import { AssetNotFoundError } from '../../../domain/errors'
import { type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type UpdateAssetUseCase } from '../../../domain/usecases/asset/update-asset'
import { badRequest, notFound, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { type Validator } from '../../protocols/validator'

export class UpdateAssetController implements Controller {
  constructor (
    private readonly updateAssetUseCase: UpdateAssetUseCase,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requestErrors = await this.validator.validate(httpRequest.body)
      if (requestErrors) {
        return badRequest(requestErrors)
      }
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const { id: assetId } = httpRequest.params
      const { description, name, healthLevel, model, owner, status, imageURL } = httpRequest.body
      const result = await this.updateAssetUseCase.update(assetId, {
        name, description, healthLevel, model, status, owner, imageURL
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
