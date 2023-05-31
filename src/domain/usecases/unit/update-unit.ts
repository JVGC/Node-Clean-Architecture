import { UnitNotFoundError } from "../../errors";
import { UnitModelResponse } from "../../models/unit";
import { UnitRepository } from "../../protocols/repositories/unit-repository";

// DECISION: User will only be able to update the company if it has role == SUPERADMIN.

export interface UpdateUnitParams {
    name?: string;
    description?: string;
    company_id?: string
}

export class UpdateUnitUseCase {
    constructor(
        private readonly unitRepository: UnitRepository
    ){}
    async update(unit_id: string, data: UpdateUnitParams): Promise<UnitModelResponse>{
        const unit = await this.unitRepository.update(unit_id, data)
        if(!unit)  throw new UnitNotFoundError()
        return unit
    }
}
