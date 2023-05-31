import { CodeAlreadyInUse, CompanyNotFoundError } from "../../../domain/errors"
import { UpdateCompanyUseCase } from "../../../domain/usecases/companies/update-company"
import { badRequest, notFound, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class UpdateCompanyController implements Controller {
  constructor (
    private readonly updateCompanyUseCase: UpdateCompanyUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id: company_id } = httpRequest.params
      const { name, code } = httpRequest.body
      const result = await this.updateCompanyUseCase.update(company_id, {
        name,
        code
      })
      return ok(result)
    } catch (error: any) {
      if(error instanceof CodeAlreadyInUse){
        return badRequest(error)
      }
      if(error instanceof CompanyNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
