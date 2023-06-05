import { UnitNotFoundError } from '../../../domain/errors'
import { type UserModelResponse } from '../../../domain/models/user'
import { type CreateAssetUseCase } from '../../../domain/usecases/asset/create-asset'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class CreateAssetController implements Controller {
  constructor (
    private readonly createAssetUseCase: CreateAssetUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponse
      const { name, description, unitId, model, owner, imageURL } = httpRequest.body
      const result = await this.createAssetUseCase.create({
        name, description, unitId, model, owner, imageURL
      }, loggedUser)
      return ok(result)
    } catch (error: any) {
      if (error instanceof UnitNotFoundError) {
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
