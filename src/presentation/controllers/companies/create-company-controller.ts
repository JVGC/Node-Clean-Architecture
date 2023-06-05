import { CodeAlreadyInUse } from '../../../domain/errors'
import { type CreateCompanyUseCase } from '../../../domain/usecases/companies/create-company'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class CreateCompanyController implements Controller {
  constructor (
    private readonly createCompanyUseCase: CreateCompanyUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, code } = httpRequest.body
      const result = await this.createCompanyUseCase.create({
        name,
        code
      })
      return ok(result)
    } catch (error: any) {
      if (error instanceof CodeAlreadyInUse) {
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
