import { CompanyNotFoundError } from '../../errors'
import { type CompanyRepository } from '../../protocols/repositories/company-repository'

// DUVIDA: What to do with the units and users that belongs to the company?
export class DeleteCompanyByIdUseCase {
  constructor (
    private readonly companyRepository: CompanyRepository
  ) {}

  async delete (company_id: string): Promise<boolean> {
    const wasDeleted = await this.companyRepository.deleteById(company_id)
    if (!wasDeleted) throw new CompanyNotFoundError()
    return wasDeleted
  }
}
