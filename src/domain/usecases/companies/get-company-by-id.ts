import { CompanyNotFoundError } from "../../errors";
import { CompanyModel } from "../../models/company";
import { UserModelResponse, UserRoles } from "../../models/user";
import { CompanyRepository } from "../../protocols/repositories/company-repository";

export class GetCompanyByIdUseCase {
    constructor(
        private readonly companyRepository: CompanyRepository
    ){}
  async get(companyId: string, user: UserModelResponse): Promise<CompanyModel>{
    if(user.role === UserRoles.Admin && companyId !== user.companyId){
      throw new CompanyNotFoundError()
    }
    const company = await this.companyRepository.getById(companyId)
    if(!company) throw new CompanyNotFoundError()

    return company
  }
}
