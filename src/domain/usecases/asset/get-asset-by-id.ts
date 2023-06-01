import { AssetNotFoundError } from "../../errors";
import { AssetModelResponse } from "../../models/asset";
import { UserModelResponse, UserRoles } from "../../models/user";
import { AssetRepository } from "../../protocols/repositories/asset-repository";

export class GetAssetByIdUseCase {
  constructor(
    private readonly assetRepository: AssetRepository,
  ){}
  async get (assetId: string, loggedUser: UserModelResponse): Promise<AssetModelResponse>{
    const asset = await this.assetRepository.getById(assetId)
      if(!asset) throw new AssetNotFoundError()
      if(loggedUser.role !== UserRoles.SuperAdmin && asset.companyId !== loggedUser.companyId)
      throw new AssetNotFoundError()
      return asset
  }
}
