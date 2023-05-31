import { UnitNotFoundError } from "../../errors"
import { UnitModelResponse } from "../../models/unit"
import { UnitRepository } from "../../protocols/repositories/unit-repository"

export class GetUnitByIdUseCase {
  constructor(
    private readonly unitRepository: UnitRepository
  ){}
  async get(unit_id: string): Promise<UnitModelResponse>{
      const unit = await this.unitRepository.getById(unit_id)
      if(!unit) throw new UnitNotFoundError()
      return unit
  }
}
