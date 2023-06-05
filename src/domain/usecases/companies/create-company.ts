import { CodeAlreadyInUse } from '../../errors'
import { type CompanyModel } from '../../models/company'
import { type CompanyRepository } from '../../protocols/repositories/company-repository'

export interface CreateCompanyParams {
  name: string
  code: string
}

export class CreateCompanyUseCase {
  constructor (
    private readonly companyRepository: CompanyRepository
  ) {}

  async create (data: CreateCompanyParams): Promise<CompanyModel> {
    const company = await this.companyRepository.getByCode(data.code)
    if (company) throw new CodeAlreadyInUse()
    return await this.companyRepository.create(data)
  }
}
