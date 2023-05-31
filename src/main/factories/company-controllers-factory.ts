import { CreateCompanyUseCase } from "../../domain/usecases/create-company-usecase";
import { GetCompanyByIdUseCase } from "../../domain/usecases/get-company-by-id-usecase";
import { PrismaCompanyRepository } from "../../infra/prisma/repositories/prisma-company-repository";
import { CreateCompanyController } from "../../presentation/controller/create-company-controller";
import { GetCompanyByIdController } from "../../presentation/controller/get-company-by-id-controller";

export const makeCreateCompany = (): CreateCompanyController => {
    const prismaCompanyRepository = new PrismaCompanyRepository()
    const createCompanyUseCase = new CreateCompanyUseCase(prismaCompanyRepository)
    return new CreateCompanyController(createCompanyUseCase)
}

export const makeGetCompanyById = (): GetCompanyByIdController => {
    const prismaCompanyRepository = new PrismaCompanyRepository()
    const getCompanyByIdUseCase = new GetCompanyByIdUseCase(prismaCompanyRepository)
    return new GetCompanyByIdController(getCompanyByIdUseCase)
}