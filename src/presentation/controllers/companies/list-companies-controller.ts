import { type ListCompaniesUseCase } from '../../../domain/usecases/companies/list-companies'
import { ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class ListCompaniesController implements Controller {
  constructor (
    private readonly listCompaniesUseCase: ListCompaniesUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.listCompaniesUseCase.list()
      return ok(result)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
