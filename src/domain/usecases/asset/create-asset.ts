import { AssetModelResponse } from "../../models/asset";
import { AssetRepository } from "../../protocols/repositories/asset-repository";
import { UnitRepository } from "../../protocols/repositories/unit-repository";

export interface CreateAssetParams {
    name: string;
    description: string;
    model: string;
    owner: string;
    unitId: string;
}

export class CreateAssetUseCase {
    constructor(
        private readonly assetRepository: AssetRepository,
        private readonly unitRepository: UnitRepository,
    ){}
    create: (data: CreateAssetParams) => Promise<AssetModelResponse>
}
