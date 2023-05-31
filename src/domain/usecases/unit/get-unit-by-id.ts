import { UnitNotFoundError } from "../../errors"
import { UnitModelResponse } from "../../models/unit"
import { UnitRepository } from "../../protocols/repositories/unit-repository"

export class GetUnitByIdUseCase {
  constructor(
    private readonly unitRepository: UnitRepository
  ){}
  async get(Unit_id: string): Promise<UnitModelResponse>{
      const unit = await this.unitRepository.getById(Unit_id)
      if(!unit) throw new UnitNotFoundError()
      return unit
  }
}
