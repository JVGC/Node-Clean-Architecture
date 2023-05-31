import { AssetModelResponse } from "../../models/asset"
import { CreateAssetParams } from "../../usecases/asset/create-asset"
import { UpdateAssetParams } from "../../usecases/asset/update-asset"

export interface AssetRepository{
    create: (data: CreateAssetParams) => Promise<AssetModelResponse>
    getById: (id: string) => Promise<AssetModelResponse | null>
    getMany: () => Promise<AssetModelResponse[]>
    deleteById: (id: string) => Promise<boolean>
    update: (id: string, updateData: UpdateAssetParams) => Promise<AssetModelResponse | null>
}