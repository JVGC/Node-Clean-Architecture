import { CompanyNotFoundError } from '../../../domain/errors'
import { type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type GetCompanyByIdUseCase } from '../../../domain/usecases/companies/get-company-by-id'
import { notFound, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class GetCompanyByIdController implements Controller {
  constructor (
    private readonly getCompanyById: GetCompanyByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const { id: companyId } = httpRequest.params
      const result = await this.getCompanyById.get(companyId, loggedUser)
      return ok(result)
    } catch (error: any) {
      if (error instanceof CompanyNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
