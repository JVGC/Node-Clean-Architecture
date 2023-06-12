import { CreateAssetUseCase } from '../../domain/usecases/asset/create-asset'
import { DeleteAssetByIdUseCase } from '../../domain/usecases/asset/delete-asset'
import { GetAssetByIdUseCase } from '../../domain/usecases/asset/get-asset-by-id'
import { ListAssetsUseCase } from '../../domain/usecases/asset/list-assets'
import { UpdateAssetUseCase } from '../../domain/usecases/asset/update-asset'
import { PrismaAssetRepository } from '../../infra/prisma/repositories/prisma-asset-repository'
import { PrismaUnitRepository } from '../../infra/prisma/repositories/prisma-unit-repository'
import { CreateAssetController } from '../../presentation/controllers/assets/create-asset-controller'
import { DeleteAssetByIdController } from '../../presentation/controllers/assets/delete-asset-by-id-controller'
import { GetAssetByIdController } from '../../presentation/controllers/assets/get-asset-by-id-controller'
import { ListAssetsController } from '../../presentation/controllers/assets/list-assets-controller'
import { UpdateAssetController } from '../../presentation/controllers/assets/update-asset-controller'
import { ZodValidator } from '../../presentation/helpers/zod-validator'
import { zodCreateAssetObject, zodUpdateAssetObject } from '../../presentation/helpers/zod-validators/assets'

export const makeCreateAsset = (): CreateAssetController => {
  const prismaAssetRepository = new PrismaAssetRepository()
  const prismaUnitRepository = new PrismaUnitRepository()
  const createAssetUseCase = new CreateAssetUseCase(prismaAssetRepository, prismaUnitRepository)
  const zodCreateAssetValidator = new ZodValidator(zodCreateAssetObject)
  return new CreateAssetController(createAssetUseCase, zodCreateAssetValidator)
}

export const makeGetAssetById = (): GetAssetByIdController => {
  const prismaAssetRepository = new PrismaAssetRepository()
  const getAssetByIdUseCase = new GetAssetByIdUseCase(prismaAssetRepository)
  return new GetAssetByIdController(getAssetByIdUseCase)
}

export const makeListAssets = (): ListAssetsController => {
  const prismaAssetRepository = new PrismaAssetRepository()
  const listAssetsUseCase = new ListAssetsUseCase(prismaAssetRepository)
  return new ListAssetsController(listAssetsUseCase)
}

export const makeDeleteAssetById = (): DeleteAssetByIdController => {
  const prismaAssetRepository = new PrismaAssetRepository()
  const deleteAssetByIdUseCase = new DeleteAssetByIdUseCase(prismaAssetRepository)
  return new DeleteAssetByIdController(deleteAssetByIdUseCase)
}

export const makeUpdateAsset = (): UpdateAssetController => {
  const prismaAssetRepository = new PrismaAssetRepository()
  const updateAssetUseCase = new UpdateAssetUseCase(prismaAssetRepository)
  const zodUpdateAssetValidator = new ZodValidator(zodUpdateAssetObject)
  return new UpdateAssetController(updateAssetUseCase, zodUpdateAssetValidator)
}
