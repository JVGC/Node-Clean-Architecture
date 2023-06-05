import { type UnitModelResponse } from '../../../domain/models/unit'
import { type UserModelResponse, UserRoles } from '../../../domain/models/user'
import { type ListUnitsUseCase } from '../../../domain/usecases/unit/list-units'
import { ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class ListUnitsController implements Controller {
  constructor (
    private readonly listUnitsUseCase: ListUnitsUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponse
      let result: UnitModelResponse[]
      if (loggedUser.role !== UserRoles.SuperAdmin) { result = await this.listUnitsUseCase.list(loggedUser.companyId) } else { result = await this.listUnitsUseCase.list() }
      return ok(result)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
