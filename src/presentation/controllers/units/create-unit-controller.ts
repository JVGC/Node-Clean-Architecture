import { CompanyNotFoundError } from '../../../domain/errors'
import { type UnitModelResponse } from '../../../domain/models/unit'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type CreateUnitUseCase } from '../../../domain/usecases/unit/create-unit'
import { notFound, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class CreateUnitController implements Controller {
  constructor (
    private readonly createUnitUseCase: CreateUnitUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const { name, description, companyId } = httpRequest.body
      let result: UnitModelResponse

      if (loggedUser.role !== UserRoles.SuperAdmin) {
        result = await this.createUnitUseCase.create({
          name, description, companyId: loggedUser.companyId
        })
      } else {
        result = await this.createUnitUseCase.create({
          name, description, companyId
        })
      }
      return ok(result)
    } catch (error: any) {
      if (error instanceof CompanyNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
