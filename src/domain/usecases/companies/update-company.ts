import { CodeAlreadyInUse, CompanyNotFoundError } from '../../errors'
import { type CompanyModel } from '../../models/company'
import { type CompanyRepository } from '../../protocols/repositories/company-repository'

// DECISION: User will only be able to update the company if it has role == SUPERADMIN.

export interface UpdateCompanyParams {
  name?: string
  code?: string
}

export class UpdateCompanyUseCase {
  constructor (
    private readonly companyRepository: CompanyRepository
  ) {}

  async update (companyId: string, data: UpdateCompanyParams): Promise<CompanyModel> {
    if (data.code) {
      const companyWithCode = await this.companyRepository.getByCode(data.code)
      if (companyWithCode && companyWithCode.id !== companyId) throw new CodeAlreadyInUse()
    }
    const company = await this.companyRepository.update(companyId, data)
    if (!company) throw new CompanyNotFoundError()
    return company
  }
}
