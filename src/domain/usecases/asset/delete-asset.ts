import { AssetNotFoundError } from '../../errors'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../models/user'
import { type AssetRepository } from '../../protocols/repositories/asset-repository'

export class DeleteAssetByIdUseCase {
  constructor (
    private readonly assetRepository: AssetRepository
  ) {}

  async delete (assetId: string, loggedUser: UserModelResponseWithoutPassword): Promise<boolean> {
    const asset = await this.assetRepository.getById(assetId)
    if (!asset) throw new AssetNotFoundError()
    if (loggedUser.role !== UserRoles.SuperAdmin && asset.companyId !== loggedUser.companyId) { throw new AssetNotFoundError() }
    const wasDeleted = await this.assetRepository.deleteById(assetId)
    if (!wasDeleted) throw new AssetNotFoundError()
    return wasDeleted
  }
}
