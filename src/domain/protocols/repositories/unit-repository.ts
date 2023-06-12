import { type UnitModelResponse } from '../../models/unit'
import { type CreateUnitParams } from '../../usecases/unit/create-unit'
import { type UpdateUnitParams } from '../../usecases/unit/update-unit'

export interface UnitRepository {
  create: (data: CreateUnitParams) => Promise<UnitModelResponse>
  getById: (id: string) => Promise<UnitModelResponse | null>
  getMany: (companyId?: string) => Promise<UnitModelResponse[]>
  deleteById: (id: string) => Promise<boolean>
  update: (id: string, updateData: UpdateUnitParams) => Promise<UnitModelResponse | null>
}
