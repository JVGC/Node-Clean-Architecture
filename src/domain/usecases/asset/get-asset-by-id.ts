import { AssetNotFoundError } from '../../errors'
import { type AssetModelResponse } from '../../models/asset'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../models/user'
import { type AssetRepository } from '../../protocols/repositories/asset-repository'

export class GetAssetByIdUseCase {
  constructor (
    private readonly assetRepository: AssetRepository
  ) {}

  async get (assetId: string, loggedUser: UserModelResponseWithoutPassword): Promise<AssetModelResponse> {
    const asset = await this.assetRepository.getById(assetId)
    if (!asset) throw new AssetNotFoundError()
    if (loggedUser.role !== UserRoles.SuperAdmin && asset.companyId !== loggedUser.companyId) { throw new AssetNotFoundError() }
    return asset
  }
}
