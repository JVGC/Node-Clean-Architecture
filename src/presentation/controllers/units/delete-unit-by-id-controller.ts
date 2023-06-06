import { UnitNotFoundError } from '../../../domain/errors'
import { type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type DeleteUnitByIdUseCase } from '../../../domain/usecases/unit/delete-unit'
import { noContent, notFound, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class DeleteUnitByIdController implements Controller {
  constructor (
    private readonly deleteUnitById: DeleteUnitByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const { id: unitId } = httpRequest.params
      await this.deleteUnitById.delete(unitId, loggedUser)
      return noContent()
    } catch (error: any) {
      if (error instanceof UnitNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
