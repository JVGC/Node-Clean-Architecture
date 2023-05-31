import { AssetNotFoundError } from "../../errors";
import { AssetModelResponse } from "../../models/asset";
import { AssetRepository } from "../../protocols/repositories/asset-repository";

export class GetAssetByIdUseCase {
  constructor(
    private readonly assetRepository: AssetRepository,
  ){}
  async get (asset_id: string): Promise<AssetModelResponse>{
    const unit = await this.assetRepository.getById(asset_id)
      if(!unit) throw new AssetNotFoundError()
      return unit
  }
}
