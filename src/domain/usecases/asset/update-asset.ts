import { AssetNotFoundError } from "../../errors";
import { AssetModelResponse, AssetsStatus } from "../../models/asset";
import { AssetRepository } from "../../protocols/repositories/asset-repository";

// DUVIDA: Does health level has any relation with status?
// DECISION: User will only be able to update the owner if it has role >= ADMIN.

export interface UpdateAssetParams {
    name?: string;
    description?: string;
    model?: string;
    owner_id?: string;
    unit_id?: string;
    health_level?: number
    status?: AssetsStatus
}

export class UpdateAssetUseCase {
    constructor(
        private readonly assetRepository: AssetRepository,
    ){}
    async update(asset_id: string, data: UpdateAssetParams): Promise<AssetModelResponse>{
        const asset = await this.assetRepository.update(asset_id, data)
        if(!asset)  throw new AssetNotFoundError()
        return asset
    }
}
