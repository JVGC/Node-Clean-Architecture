import { UnitModelResponse } from "../../models/unit"
import { CreateUnitParams } from "../../usecases/unit/create-unit"
import { UpdateUnitParams } from "../../usecases/unit/update-unit"

export interface UnitRepository{
    create: (data: CreateUnitParams) => Promise<UnitModelResponse>
    getById: (id: string) => Promise<UnitModelResponse | null>
    getMany: (companyId?: string) => Promise<UnitModelResponse[]>
    deleteById: (id: string) => Promise<boolean>
    update: (id: string, updateData: UpdateUnitParams) => Promise<UnitModelResponse | null>
}