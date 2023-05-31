import { ObjectId } from "mongodb";
import { CompanyModel } from "../../../domain/models/company";
import { CompanyRepository } from "../../../domain/protocols/repositories/company-repository";
import { CreateCompanyParams } from "../../../domain/usecases/create-company-usecase";
import prisma from "../client";

export class PrismaCompanyRepository implements CompanyRepository{
    async getByCode(code: string): Promise<CompanyModel | null>{
        const company = await prisma.company.findUnique({
            where:{
                code
            }
        })
        return company
    }
    async getById(id: string): Promise<CompanyModel | null>{
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) return null
        const company = await prisma.company.findUnique({
            where:{
                id: new ObjectId(id).toString()
            }
        })
        return company
    }
    async create({code, name}: CreateCompanyParams): Promise<CompanyModel>{
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