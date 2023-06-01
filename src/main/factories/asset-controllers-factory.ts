import { CreateAssetUseCase } from "../../domain/usecases/asset/create-asset"
import { DeleteAssetByIdUseCase } from "../../domain/usecases/asset/delete-asset"
import { GetAssetByIdUseCase } from "../../domain/usecases/asset/get-asset-by-id"
import { ListAssetsUseCase } from "../../domain/usecases/asset/list-assets"
import { UpdateAssetUseCase } from "../../domain/usecases/asset/update-asset"
import { LocalImageRepository } from "../../infra/image/local-image-repository"
import { PrismaAssetRepository } from "../../infra/prisma/repositories/prisma-asset-repository"
import { PrismaUnitRepository } from "../../infra/prisma/repositories/prisma-unit-repository"
import { CreateAssetController } from "../../presentation/controllers/assets/create-asset-controller"
import { DeleteAssetByIdController } from "../../presentation/controllers/assets/delete-asset-by-id-controller"
import { GetAssetByIdController } from "../../presentation/controllers/assets/get-asset-by-id-controller"
import { ListAssetsController } from "../../presentation/controllers/assets/list-assets-controller"
import { UpdateAssetController } from "../../presentation/controllers/assets/update-asset-controller"

export const makeCreateAsset = (): CreateAssetController => {
    const localImageRepository = new LocalImageRepository()
    const prismaAssetRepository = new PrismaAssetRepository()
    const prismaUnitRepository = new PrismaUnitRepository()
    const createAssetUseCase = new CreateAssetUseCase(prismaAssetRepository, prismaUnitRepository, localImageRepository)
    return new CreateAssetController(createAssetUseCase)
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
    return new UpdateAssetController(updateAssetUseCase)
}