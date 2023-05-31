import { Company } from "../../../domain/models/company";
import { CompanyRepository } from "../../../domain/protocols/repositories/company-repository";
import { CreateCompanyParams } from "../../../domain/usecases/create-company-usecase";
import prisma from "../client";

export class PrismaCompanyRepository implements CompanyRepository{
    async getByCode(code: string): Promise<Company | null>{
        const company = await prisma.company.findUnique({
            where:{
                code
            }
        })
        return company
    }
    async getById(id: string): Promise<Company | null>{
        const company = await prisma.company.findUnique({
            where:{
                id
            }
        })
        return company
    }
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