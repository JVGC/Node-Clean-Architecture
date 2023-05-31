import { CodeAlreadyInUse, CompanyNotFoundError } from "../errors";
import { CompanyModel } from "../models/company";
import { CompanyRepository } from "../protocols/repositories/company-repository";

// DECISION: User will only be able to update the company if it has role == SUPERADMIN.

export interface UpdateCompanyParams {
    name?: string;
    code?: string;
}

export class UpdateCompanyUseCase {
    constructor(
        private readonly companyRepository: CompanyRepository
    ){}
    async update(company_id: string, data: UpdateCompanyParams): Promise<CompanyModel>{
        if(data.code){
            const isCodeInUse = await this.companyRepository.getByCode(data.code)
            if(isCodeInUse) throw new CodeAlreadyInUse()
        }
        const company = await this.companyRepository.update(company_id, data)
        if(!company)  throw new CompanyNotFoundError()
        return company
    }
}
