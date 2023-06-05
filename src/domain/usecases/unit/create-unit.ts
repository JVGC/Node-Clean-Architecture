import { CompanyNotFoundError } from '../../errors'
import { type UnitModelResponse } from '../../models/unit'
import { type CompanyRepository } from '../../protocols/repositories/company-repository'
import { type UnitRepository } from '../../protocols/repositories/unit-repository'

export interface CreateUnitParams {
  name: string
  description: string
  companyId: string
}

export class CreateUnitUseCase {
  constructor (
    private readonly unitRepository: UnitRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  async create (data: CreateUnitParams): Promise<UnitModelResponse> {
    const company = await this.companyRepository.getById(data.companyId)
    if (!company) throw new CompanyNotFoundError()
    const unit = await this.unitRepository.create(data)

    return unit
  }
}
