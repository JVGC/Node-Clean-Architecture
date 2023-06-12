import { UnitNotFoundError } from '../../errors'
import { type UnitModelResponse } from '../../models/unit'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../models/user'
import { type UnitRepository } from '../../protocols/repositories/unit-repository'

export class GetUnitByIdUseCase {
  constructor (
    private readonly unitRepository: UnitRepository
  ) {}

  async get (unitId: string, loggedUser: UserModelResponseWithoutPassword): Promise<UnitModelResponse> {
    const unit = await this.unitRepository.getById(unitId)
    if (!unit) throw new UnitNotFoundError()
    if (loggedUser.role !== UserRoles.SuperAdmin && unit.companyId !== loggedUser.companyId) { throw new UnitNotFoundError() }
    return unit
  }
}
