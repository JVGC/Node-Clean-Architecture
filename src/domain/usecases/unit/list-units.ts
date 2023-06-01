import { UnitModelResponse } from "../../models/unit";
import { UnitRepository } from "../../protocols/repositories/unit-repository";

export class ListUnitsUseCase {
  constructor(
    private readonly unitRepository: UnitRepository
  ){}
  async list(companyId?: string): Promise<UnitModelResponse[]>{
    if(companyId)
      return await this.unitRepository.getMany(companyId)
    else
      return await this.unitRepository.getMany()
  }
}
