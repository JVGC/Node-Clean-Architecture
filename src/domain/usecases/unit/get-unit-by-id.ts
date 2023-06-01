import { UnitNotFoundError } from "../../errors"
import { UnitModelResponse } from "../../models/unit"
import { UserModelResponse, UserRoles } from "../../models/user"
import { UnitRepository } from "../../protocols/repositories/unit-repository"

export class GetUnitByIdUseCase {
  constructor(
    private readonly unitRepository: UnitRepository
  ){}
  async get(unitId: string, loggedUser: UserModelResponse): Promise<UnitModelResponse>{
      const unit = await this.unitRepository.getById(unitId)
      if(!unit) throw new UnitNotFoundError()
      if(loggedUser.role !== UserRoles.SuperAdmin && unit.companyId !== loggedUser.companyId)
      throw new UnitNotFoundError()
      return unit
  }
}
