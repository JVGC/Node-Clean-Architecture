import { CompanyNotFoundError, EmailAlreadyInUse } from "../../../domain/errors"
import { CreateUserUseCase } from "../../../domain/usecases/users/create-user"
import { badRequest, ok, serverError } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class CreateUserController implements Controller {
  constructor (
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, name,  password, role, companyId } = httpRequest.body
      const result = await this.createUserUseCase.create({
        email, name,  password, role, companyId
      })
      return ok(result)
    } catch (error: any) {
      if(error instanceof EmailAlreadyInUse){
        return badRequest(error)
      }
      if(error instanceof CompanyNotFoundError){
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
