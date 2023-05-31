import { CompanyNotFoundError } from "../../domain/errors"
import { GetCompanyByIdUseCase } from "../../domain/usecases/companies/get-company-by-id"
import { notFound, ok, serverError } from "../helpers/http-helper"
import { Controller } from "../protocols/controller"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class GetCompanyByIdController implements Controller {
  constructor (
    private readonly getCompanyById: GetCompanyByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id: company_id } = httpRequest.params
      const result = await this.getCompanyById.get(company_id)
      return ok(result)
    } catch (error: any) {
      if(error instanceof CompanyNotFoundError){
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
