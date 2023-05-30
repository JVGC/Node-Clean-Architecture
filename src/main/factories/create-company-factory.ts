import { CreateCompanyUseCase } from "../../domain/usecases/create-company-usecase";
import { PrismaCompanyRepository } from "../../infra/prisma/repositories/prisma-company-repository";
import { CreateCompanyController } from "../../presentation/controller/create-company-controller";

export const makeCreateCompanyFactory = (): CreateCompanyController => {
    const prismaCompanyRepository = new PrismaCompanyRepository()
    const createCompanyUseCase = new CreateCompanyUseCase(prismaCompanyRepository)
    return new CreateCompanyController(createCompanyUseCase)
}