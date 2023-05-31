import { CodeAlreadyInUse } from "../../../domain/errors"
import { ListCompaniesUseCase } from "../../../domain/usecases/companies/list-companies"
import { badRequest, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class ListCompaniesController implements Controller {
  constructor (
    private readonly listCompaniesUseCase: ListCompaniesUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.listCompaniesUseCase.list()
      return ok(result)
    } catch (error: any) {
      if(error instanceof CodeAlreadyInUse){
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
