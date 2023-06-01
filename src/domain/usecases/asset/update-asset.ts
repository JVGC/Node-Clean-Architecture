import { AssetNotFoundError } from "../../errors";
import { AssetModelResponse, AssetsStatus } from "../../models/asset";
import { UserModelResponse, UserRoles } from "../../models/user";
import { AssetRepository } from "../../protocols/repositories/asset-repository";

// DUVIDA: Does health level has any relation with status?
// DECISION: User will only be able to update the owner if it has role >= ADMIN.

export interface UpdateAssetParams {
    name?: string;
    description?: string;
    model?: string;
    owner?: string;
    unitId?: string;
    healthLevel?: number
    status?: AssetsStatus
}

export class UpdateAssetUseCase {
    constructor(
        private readonly assetRepository: AssetRepository
    ){}
    async update(assetId: string, data: UpdateAssetParams, loggedUser: UserModelResponse): Promise<AssetModelResponse>{
        const asset = await this.assetRepository.update(assetId, data)
        if(!asset)  throw new AssetNotFoundError()

        if(loggedUser.role !== UserRoles.SuperAdmin && asset.companyId !== loggedUser.companyId)
            throw new AssetNotFoundError()
        return asset
    }
}
