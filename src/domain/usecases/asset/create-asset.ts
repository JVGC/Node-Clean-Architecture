import { UnitNotFoundError } from "../../errors";
import { AssetModelResponse } from "../../models/asset";
import { UserModelResponse, UserRoles } from "../../models/user";
import { AssetRepository } from "../../protocols/repositories/asset-repository";
import { ImageRepository } from "../../protocols/repositories/image-repository";
import { UnitRepository } from "../../protocols/repositories/unit-repository";

export interface CreateAssetParams {
    name: string;
    description: string;
    model: string;
    image?: string;
    owner: string;
    unitId: string;
}

export class CreateAssetUseCase {
    constructor(
        private readonly assetRepository: AssetRepository,
        private readonly unitRepository: UnitRepository,
        private readonly imageRepository: ImageRepository
    ){}
    async create(data: CreateAssetParams, loggedUser: UserModelResponse): Promise<AssetModelResponse>{
        const unit = await this.unitRepository.getById(data.unitId)
        if(!unit) throw new UnitNotFoundError()
        if(loggedUser.role === UserRoles.SuperAdmin || unit.companyId === loggedUser.companyId){
            const asset = await this.assetRepository.create(data)
            if(data.image){
                await this.imageRepository.create(data.image, asset.id)
            }
            return asset

        }else
            throw new UnitNotFoundError()
    }
}
