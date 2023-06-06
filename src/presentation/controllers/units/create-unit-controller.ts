import { CompanyNotFoundError } from '../../../domain/errors'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type CreateUnitUseCase } from '../../../domain/usecases/unit/create-unit'
import { badRequest, created, notFound, serverError } from '../../helpers/http-helper'
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

      if (loggedUser.role !== UserRoles.SuperAdmin && loggedUser.companyId !== companyId) {
        return badRequest(new CompanyNotFoundError())
      }

      const result = await this.createUnitUseCase.create({ name, description, companyId })
      return created(result)
    } catch (error: any) {
      if (error instanceof CompanyNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
