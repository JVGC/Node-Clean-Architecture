import { AssetNotFoundError } from '../../errors'
import { type AssetModelResponse, type AssetsStatus } from '../../models/asset'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../models/user'
import { type AssetRepository } from '../../protocols/repositories/asset-repository'

// DUVIDA: Does health level has any relation with status?
// DECISION: User will only be able to update the owner if it has role >= ADMIN.

export interface UpdateAssetParams {
  name?: string
  description?: string
  model?: string
  owner?: string
  imageURL?: string
  healthLevel?: number
  status?: AssetsStatus
}

export class UpdateAssetUseCase {
  constructor (
    private readonly assetRepository: AssetRepository
  ) {}

  async update (assetId: string, data: UpdateAssetParams, loggedUser: UserModelResponseWithoutPassword): Promise<AssetModelResponse> {
    const asset = await this.assetRepository.getById(assetId)
    if (!asset) throw new AssetNotFoundError()

    if (loggedUser.role !== UserRoles.SuperAdmin && asset.companyId !== loggedUser.companyId) { throw new AssetNotFoundError() }
    const updatedAsset = await this.assetRepository.update(assetId, data)

    if (!updatedAsset) throw new AssetNotFoundError()
    return updatedAsset
  }
}
