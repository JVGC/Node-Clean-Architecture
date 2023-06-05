import { UnitNotFoundError } from '../../errors'
import { type UnitModelResponse } from '../../models/unit'
import { type UserModelResponse, UserRoles } from '../../models/user'
import { type UnitRepository } from '../../protocols/repositories/unit-repository'

export class GetUnitByIdUseCase {
  constructor (
    private readonly unitRepository: UnitRepository
  ) {}

  async get (unitId: string, loggedUser: UserModelResponse): Promise<UnitModelResponse> {
    const unit = await this.unitRepository.getById(unitId)
    if (!unit) throw new UnitNotFoundError()
    if (loggedUser.role !== UserRoles.SuperAdmin && unit.companyId !== loggedUser.companyId) { throw new UnitNotFoundError() }
    return unit
  }
}
