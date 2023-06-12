import { CreateUnitUseCase } from '../../domain/usecases/unit/create-unit'
import { DeleteUnitByIdUseCase } from '../../domain/usecases/unit/delete-unit'
import { GetUnitByIdUseCase } from '../../domain/usecases/unit/get-unit-by-id'
import { ListUnitsUseCase } from '../../domain/usecases/unit/list-units'
import { UpdateUnitUseCase } from '../../domain/usecases/unit/update-unit'
import { PrismaCompanyRepository } from '../../infra/prisma/repositories/prisma-company-repository'
import { PrismaUnitRepository } from '../../infra/prisma/repositories/prisma-unit-repository'
import { CreateUnitController } from '../../presentation/controllers/units/create-unit-controller'
import { DeleteUnitByIdController } from '../../presentation/controllers/units/delete-unit-by-id-controller'
import { GetUnitByIdController } from '../../presentation/controllers/units/get-unit-by-id-controller'
import { ListUnitsController } from '../../presentation/controllers/units/list-units-controller'
import { UpdateUnitController } from '../../presentation/controllers/units/update-unit-controller'
import { ZodValidator } from '../../presentation/helpers/zod-validator'
import { zodCreateUnitObject, zodUpdateUnitObject } from '../../presentation/helpers/zod-validators/units'

export const makeCreateUnit = (): CreateUnitController => {
  const prismaUnitRepository = new PrismaUnitRepository()
  const prismacompanyRepository = new PrismaCompanyRepository()
  const createUnitUseCase = new CreateUnitUseCase(prismaUnitRepository, prismacompanyRepository)
  const zodCreateUnitValidator = new ZodValidator(zodCreateUnitObject)
  return new CreateUnitController(createUnitUseCase, zodCreateUnitValidator)
}

export const makeGetUnitById = (): GetUnitByIdController => {
  const prismaUnitRepository = new PrismaUnitRepository()
  const getUnitByIdUseCase = new GetUnitByIdUseCase(prismaUnitRepository)
  return new GetUnitByIdController(getUnitByIdUseCase)
}

export const makeListUnits = (): ListUnitsController => {
  const prismaUnitRepository = new PrismaUnitRepository()
  const listUnitsUseCase = new ListUnitsUseCase(prismaUnitRepository)
  return new ListUnitsController(listUnitsUseCase)
}

export const makeDeleteUnitById = (): DeleteUnitByIdController => {
  const prismaUnitRepository = new PrismaUnitRepository()
  const deleteUnitByIdUseCase = new DeleteUnitByIdUseCase(prismaUnitRepository)
  return new DeleteUnitByIdController(deleteUnitByIdUseCase)
}

export const makeUpdateUnit = (): UpdateUnitController => {
  const prismaUnitRepository = new PrismaUnitRepository()
  const updateUnitUseCase = new UpdateUnitUseCase(prismaUnitRepository)
  const zodUpdateUnitValidator = new ZodValidator(zodUpdateUnitObject)
  return new UpdateUnitController(updateUnitUseCase, zodUpdateUnitValidator)
}
