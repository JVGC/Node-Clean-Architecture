import { AssetModelResponse } from "../../models/asset"
import { AssetRepository } from "../../protocols/repositories/asset-repository"

// DECISION: Usually, I would do pagination here, but as it is a small project for now, I will work on other things.
export class ListAssetsUseCase {
  constructor(
    private readonly assetRepository: AssetRepository,
){}
  async list(): Promise<AssetModelResponse[]>{
    return await this.assetRepository.getMany()
  }
}
