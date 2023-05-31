import { Company } from "../../../domain/models/company";
import { CompanyRepository } from "../../../domain/protocols/repositories/company-repository";
import { CreateCompanyParams } from "../../../domain/usecases/create-company-usecase";
import prisma from "../client";

export class PrismaCompanyRepository implements CompanyRepository{
    async create({code, name}: CreateCompanyParams): Promise<Company>{
        const company = await prisma.company.create({
            data:{
                name,
                code
            }
        })

        // TODO: Create a mapping between two objects
        return company
    }

}