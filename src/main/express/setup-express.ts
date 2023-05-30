import express, { Router } from 'express'

import { CreateCompanyUseCase } from "../../domain/usecases/create-company-usecase"
import { PrismaCompanyRepository } from "../../infra/prisma/repositories/prisma-company-repository"
import { CreateCompanyController } from "../../presentation/controller/create-company-controller"
import { adaptRoute } from "../adapters/express-adapter"
import { bodyParser, contentType, cors } from "./middlewares/basic-middlewares"

const prismaCompanyRepository = new PrismaCompanyRepository()
const createCompanyUseCase = new CreateCompanyUseCase(prismaCompanyRepository)
const createCompanyController = new CreateCompanyController(createCompanyUseCase)

const expressApp = express()
expressApp.use(bodyParser)
expressApp.use(cors)
expressApp.use(contentType)


const router = Router()
expressApp.use('/', router)
router.post('/company', adaptRoute(createCompanyController))

export default expressApp