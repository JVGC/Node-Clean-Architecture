import { CreateCompanyUseCase } from "../../domain/usecases/create-company";
import { GetCompanyByIdUseCase } from "../../domain/usecases/get-company-by-id";
import { ListCompaniesUseCase } from "../../domain/usecases/list-companies";
import { PrismaCompanyRepository } from "../../infra/prisma/repositories/prisma-company-repository";
import { CreateCompanyController } from "../../presentation/controller/create-company-controller";
import { GetCompanyByIdController } from "../../presentation/controller/get-company-by-id-controller";
import { ListCompaniesController } from "../../presentation/controller/list-companies-controller";

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

export const makeListCompanies = (): ListCompaniesController => {
    const prismaCompanyRepository = new PrismaCompanyRepository()
    const listCompaniesUseCase = new ListCompaniesUseCase(prismaCompanyRepository)
    return new ListCompaniesController(listCompaniesUseCase)
}