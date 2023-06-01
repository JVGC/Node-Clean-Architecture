import { UnitNotFoundError } from "../../errors";
import { UnitModelResponse } from "../../models/unit";
import { UserModelResponse, UserRoles } from "../../models/user";
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
    async update(unitId: string, data: UpdateUnitParams, loggedUser: UserModelResponse): Promise<UnitModelResponse>{
        let unit = await this.unitRepository.getById(unitId)
        if(!unit) throw new UnitNotFoundError()
        if(loggedUser.role !== UserRoles.SuperAdmin && unit.companyId !== loggedUser.companyId)
        throw new UnitNotFoundError()

        unit = await this.unitRepository.update(unitId, data)
        return unit!
    }
}
