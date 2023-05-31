import { CreateCompanyUseCase } from "../../domain/usecases/companies/create-company";
import { DeleteCompanyByIdUseCase } from "../../domain/usecases/companies/delete-company";
import { GetCompanyByIdUseCase } from "../../domain/usecases/companies/get-company-by-id";
import { ListCompaniesUseCase } from "../../domain/usecases/companies/list-companies";
import { UpdateCompanyUseCase } from "../../domain/usecases/companies/update-company";
import { PrismaCompanyRepository } from "../../infra/prisma/repositories/prisma-company-repository";
import { CreateCompanyController } from "../../presentation/controller/create-company-controller";
import { DeleteCompanyByIdController } from "../../presentation/controller/delete-company-by-id-controller";
import { GetCompanyByIdController } from "../../presentation/controller/get-company-by-id-controller";
import { ListCompaniesController } from "../../presentation/controller/list-companies-controller";
import { UpdateCompanyController } from "../../presentation/controller/update-company-controller";

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

export const makeDeleteCompanyById = (): DeleteCompanyByIdController => {
    const prismaCompanyRepository = new PrismaCompanyRepository()
    const deleteCompanyByIdUseCase = new DeleteCompanyByIdUseCase(prismaCompanyRepository)
    return new DeleteCompanyByIdController(deleteCompanyByIdUseCase)
}

export const makeUpdateCompany = (): UpdateCompanyController => {
    const prismaCompanyRepository = new PrismaCompanyRepository()
    const updateCompanyUseCase = new UpdateCompanyUseCase(prismaCompanyRepository)
    return new UpdateCompanyController(updateCompanyUseCase)
}