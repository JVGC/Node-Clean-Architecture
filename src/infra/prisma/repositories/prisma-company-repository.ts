import { Prisma } from "@prisma/client";
import { ObjectId } from "mongodb";
import { CompanyModel } from "../../../domain/models/company";
import { CompanyRepository } from "../../../domain/protocols/repositories/company-repository";
import { CreateCompanyParams } from "../../../domain/usecases/companies/create-company";
import { UpdateCompanyParams } from "../../../domain/usecases/companies/update-company";
import prisma from "../client";

export class PrismaCompanyRepository implements CompanyRepository{
    async update(id: string, {code, name}: UpdateCompanyParams): Promise<CompanyModel | null>{
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) return null
        try{
            const company = await prisma.company.update({
                where:{
                    id: new ObjectId(id).toString()
                },
                data:{
                    name,
                    code
                }
            })
            return company
        }catch(error: any){
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025')
                    return null
            }
            throw error
        }
    }
    // TODO: Impletement Soft Delete
    async deleteById(id: string): Promise<boolean>{
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) return false
        try{
            await prisma.company.delete({
                where:{
                    id: new ObjectId(id).toString()
                }
            })
            return true
        }catch(error: any){
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025')
                    return false
            }
            throw error
        }
    }
    async getMany(): Promise<CompanyModel[]>{
        return await prisma.company.findMany()
    }
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