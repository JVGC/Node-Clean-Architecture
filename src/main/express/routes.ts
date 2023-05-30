import { Express, Router } from 'express'
import { CreateCompanyUseCase } from '../../domain/usecases/create-company-usecase'
import { PrismaCompanyRepository } from '../../infra/prisma/repositories/prisma-company-repository'
import { CreateCompanyController } from '../../presentation/controller/create-company-controller'
import { adaptRoute } from '../adapters/express-adapter'

export default (app: Express): void => {


    const prismaCompanyRepository = new PrismaCompanyRepository()
    const createCompanyUseCase = new CreateCompanyUseCase(prismaCompanyRepository)
    const createCompanyController = new CreateCompanyController(createCompanyUseCase)
    const router = Router()
    app.use('/', router)
    app.use('/', router)
    router.post('/company', adaptRoute(createCompanyController))
  }