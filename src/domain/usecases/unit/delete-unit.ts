import { UnitNotFoundError } from '../../errors'
import { type UserModelResponse, UserRoles } from '../../models/user'
import { type UnitRepository } from '../../protocols/repositories/unit-repository'

// DUVIDA: What to do with the assets that belongs to the unit?
export class DeleteUnitByIdUseCase {
  constructor (
    private readonly unitRepository: UnitRepository
  ) {}

  async delete (unitId: string, loggedUser: UserModelResponse): Promise<boolean> {
    const unit = await this.unitRepository.getById(unitId)
    if (!unit) throw new UnitNotFoundError()
    if (loggedUser.role !== UserRoles.SuperAdmin && unit.companyId !== loggedUser.companyId) { throw new UnitNotFoundError() }
    const wasDeleted = await this.unitRepository.deleteById(unitId)
    if (!wasDeleted) throw new UnitNotFoundError()
    return wasDeleted
  }
}
