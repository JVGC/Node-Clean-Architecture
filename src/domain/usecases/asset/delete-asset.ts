import { AssetNotFoundError } from "../../errors";
import { AssetRepository } from "../../protocols/repositories/asset-repository";

export class DeleteAssetByIdUseCase {
  constructor(
    private readonly assetRepository: AssetRepository,
){}
  async delete(asset_id: string): Promise<boolean>{
    const wasDeleted = await this.assetRepository.deleteById(asset_id)
    if(!wasDeleted) throw new AssetNotFoundError()
    return wasDeleted
  }
}
