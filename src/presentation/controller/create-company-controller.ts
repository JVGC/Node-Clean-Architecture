import { CreateCompanyUseCase } from "../../domain/usecases/create-company-usecase"
import { ok, serverError } from "../helpers/http-helper"
import { Controller } from "../protocols/controller"
import { HttpRequest, HttpResponse } from "../protocols/http"

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
      return serverError(error)
    }
  }
}
