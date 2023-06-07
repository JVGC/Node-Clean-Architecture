import { CodeAlreadyInUse } from '../../../domain/errors'
import { type CreateCompanyUseCase } from '../../../domain/usecases/companies/create-company'
import { badRequest, created, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { type Validator } from '../../protocols/validator'

export class CreateCompanyController implements Controller {
  constructor (
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requestErrors = await this.validator.validate(httpRequest.body)
      if (requestErrors) {
        return badRequest(requestErrors)
      }
      const { name, code } = httpRequest.body
      const result = await this.createCompanyUseCase.create({
        name,
        code
      })
      return created(result)
    } catch (error: any) {
      if (error instanceof CodeAlreadyInUse) {
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
