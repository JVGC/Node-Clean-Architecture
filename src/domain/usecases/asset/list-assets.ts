import { type AssetModelResponse } from '../../models/asset'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../models/user'
import { type AssetRepository } from '../../protocols/repositories/asset-repository'

// DECISION: Usually, I would do pagination here, but as it is a small project for now, I will work on other things.
export class ListAssetsUseCase {
  constructor (
    private readonly assetRepository: AssetRepository
  ) {}

  async list (loggedUser: UserModelResponseWithoutPassword): Promise<AssetModelResponse[]> {
    if (loggedUser.role !== UserRoles.SuperAdmin) {
      return await this.assetRepository.getMany(loggedUser.companyId)
    } else {
      return await this.assetRepository.getMany()
    }
  }
}
