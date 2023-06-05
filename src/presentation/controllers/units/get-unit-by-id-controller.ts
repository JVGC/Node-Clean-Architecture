import { UnitNotFoundError } from '../../../domain/errors'
import { type UserModelResponse } from '../../../domain/models/user'
import { type GetUnitByIdUseCase } from '../../../domain/usecases/unit/get-unit-by-id'
import { notFound, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class GetUnitByIdController implements Controller {
  constructor (
    private readonly getUnitById: GetUnitByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponse
      const { id: unitId } = httpRequest.params
      const result = await this.getUnitById.get(unitId, loggedUser)
      return ok(result)
    } catch (error: any) {
      if (error instanceof UnitNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
