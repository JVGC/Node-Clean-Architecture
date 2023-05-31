import { UnitNotFoundError } from "../../errors"
import { UnitRepository } from "../../protocols/repositories/unit-repository"

// DUVIDA: What to do with the assets that belongs to the unit?
export class DeleteUnitByIdUseCase {
  constructor(
    private readonly unitRepository: UnitRepository
  ){}
  async delete(unit_id: string): Promise<boolean>{
    const wasDeleted = await this.unitRepository.deleteById(unit_id)
    if(!wasDeleted) throw new UnitNotFoundError()
    return wasDeleted
  }
}
