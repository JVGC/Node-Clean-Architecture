import { UnitNotFoundError } from '../../../domain/errors'
import { type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type CreateAssetUseCase } from '../../../domain/usecases/asset/create-asset'
import { badRequest, created, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { type Validator } from '../../protocols/validator'

export class CreateAssetController implements Controller {
  constructor (
    private readonly createAssetUseCase: CreateAssetUseCase,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requestErrors = await this.validator.validate(httpRequest.body)
      if (requestErrors) {
        return badRequest(requestErrors)
      }
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const { name, description, unitId, model, owner, imageURL } = httpRequest.body
      const result = await this.createAssetUseCase.create({
        name, description, unitId, model, owner, imageURL
      }, loggedUser)
      return created(result)
    } catch (error: any) {
      if (error instanceof UnitNotFoundError) {
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
