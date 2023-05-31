import { AssetModelResponse } from "../../models/asset";
import { AssetRepository } from "../../protocols/repositories/asset-repository";

export class GetAssetByIdUseCase {
  constructor(
    private readonly assetRepository: AssetRepository,
  ){}
  get: (asset_id: string) => Promise<AssetModelResponse>
}
