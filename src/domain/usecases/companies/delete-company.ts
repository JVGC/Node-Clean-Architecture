import { CompanyNotFoundError } from '../../errors'
import { type CompanyRepository } from '../../protocols/repositories/company-repository'

// DUVIDA: What to do with the units and users that belongs to the company?
export class DeleteCompanyByIdUseCase {
  constructor (
    private readonly companyRepository: CompanyRepository
  ) {}

  async delete (companyId: string): Promise<boolean> {
    const wasDeleted = await this.companyRepository.deleteById(companyId)
    if (!wasDeleted) throw new CompanyNotFoundError()
    return wasDeleted
  }
}
