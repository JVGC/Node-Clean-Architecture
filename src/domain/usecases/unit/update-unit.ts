import { UnitNotFoundError } from '../../errors'
import { type UnitModelResponse } from '../../models/unit'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../models/user'
import { type UnitRepository } from '../../protocols/repositories/unit-repository'

// DECISION: User will only be able to update the company if it has role == SUPERADMIN.

export interface UpdateUnitParams {
  name?: string
  description?: string
  company_id?: string
}

export class UpdateUnitUseCase {
  constructor (
    private readonly unitRepository: UnitRepository
  ) {}

  async update (unitId: string, data: UpdateUnitParams, loggedUser: UserModelResponseWithoutPassword): Promise<UnitModelResponse> {
    let unit = await this.unitRepository.getById(unitId)
    if (!unit) throw new UnitNotFoundError()
    if (loggedUser.role !== UserRoles.SuperAdmin && unit.companyId !== loggedUser.companyId) { throw new UnitNotFoundError() }

    unit = await this.unitRepository.update(unitId, data)
    return unit!
  }
}
