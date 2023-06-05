import { type CompanyModel } from '../../models/company'
import { type CompanyRepository } from '../../protocols/repositories/company-repository'

export class ListCompaniesUseCase {
  constructor (
    private readonly companyRepository: CompanyRepository
  ) {}

  async list (): Promise<CompanyModel[]> {
    return await this.companyRepository.getMany()
  }
}
