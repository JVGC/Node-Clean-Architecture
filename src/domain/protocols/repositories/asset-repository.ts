import { type AssetModelResponse } from '../../models/asset'
import { type CreateAssetParams } from '../../usecases/asset/create-asset'
import { type UpdateAssetParams } from '../../usecases/asset/update-asset'

export interface AssetRepository {
  create: (data: CreateAssetParams) => Promise<AssetModelResponse>
  getById: (id: string) => Promise<AssetModelResponse | null>
  getMany: (companyId?: string) => Promise<AssetModelResponse[]>
  deleteById: (id: string) => Promise<boolean>
  update: (id: string, updateData: UpdateAssetParams) => Promise<AssetModelResponse | null>
}
