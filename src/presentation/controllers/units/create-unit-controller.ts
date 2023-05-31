import { CompanyNotFoundError } from "../../../domain/errors"
import { CreateUnitUseCase } from "../../../domain/usecases/unit/create-unit"
import { badRequest, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class CreateUnitController implements Controller {
  constructor (
    private readonly createUnitUseCase: CreateUnitUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, description, companyId } = httpRequest.body
      const result = await this.createUnitUseCase.create({
        name, description, companyId
      })
      return ok(result)
    } catch (error: any) {
      if(error instanceof CompanyNotFoundError){
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
