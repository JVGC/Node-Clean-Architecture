import { AssetRepository } from "../../protocols/repositories/asset-repository";

export class DeleteAssetByIdUseCase {
  constructor(
    private readonly assetRepository: AssetRepository,
){}
  delete: (asset_id: string) => Promise<boolean>
}
