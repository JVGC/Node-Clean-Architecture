import { UnitModelResponse } from "../../models/unit";
import { UnitRepository } from "../../protocols/repositories/unit-repository";

export class ListUnitsUseCase {
  constructor(
    private readonly unitRepository: UnitRepository
  ){}
  async list(): Promise<UnitModelResponse[]>{
    return await this.unitRepository.getMany()
  }
}
