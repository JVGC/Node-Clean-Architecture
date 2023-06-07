import { UnitNotFoundError } from '../../../domain/errors'
import { type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type UpdateUnitUseCase } from '../../../domain/usecases/unit/update-unit'
import { badRequest, notFound, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { type Validator } from '../../protocols/validator'

export class UpdateUnitController implements Controller {
  constructor (
    private readonly updateUnitUseCase: UpdateUnitUseCase,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requestErrors = await this.validator.validate(httpRequest.body)
      if (requestErrors) {
        return badRequest(requestErrors)
      }
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const { id: unitId } = httpRequest.params
      const { description, name } = httpRequest.body
      const result = await this.updateUnitUseCase.update(unitId, {
        name, description
      }, loggedUser)
      return ok(result)
    } catch (error: any) {
      if (error instanceof UnitNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
