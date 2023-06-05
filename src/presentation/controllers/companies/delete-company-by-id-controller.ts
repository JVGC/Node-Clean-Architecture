import { CompanyNotFoundError } from '../../../domain/errors'
import { type DeleteCompanyByIdUseCase } from '../../../domain/usecases/companies/delete-company'
import { notFound, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class DeleteCompanyByIdController implements Controller {
  constructor (
    private readonly deleteCompanyById: DeleteCompanyByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id: company_id } = httpRequest.params
      const result = await this.deleteCompanyById.delete(company_id)
      return ok(result)
    } catch (error: any) {
      if (error instanceof CompanyNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
