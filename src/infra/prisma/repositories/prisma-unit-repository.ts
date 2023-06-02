import { Prisma } from "@prisma/client";
import { ObjectId } from "mongodb";
import { UnitModelResponse } from "../../../domain/models/unit";
import { UnitRepository } from "../../../domain/protocols/repositories/unit-repository";
import { CreateUnitParams } from "../../../domain/usecases/unit/create-unit";
import { UpdateUnitParams } from "../../../domain/usecases/unit/update-unit";
import { adaptUnit } from "../adapters/unit-adapter";
import prisma from "../client";

export class PrismaUnitRepository implements UnitRepository{
    async create({name, companyId, description}: CreateUnitParams): Promise<UnitModelResponse>{
        const unit = await prisma.unit.create({
            data:{
                name,
                description,
                companyId: companyId,
            },
            include:{
                company:{
                    select:{
                        name: true
                    }
                }
            }
        })

        return adaptUnit(unit)
    }
    async getById(id: string): Promise<UnitModelResponse | null>{
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) return null
        const unit = await prisma.unit.findUnique({
            where:{
                id
            },
            include:{
                company:{
                    select:{
                        name: true
                    }
                }
            }
        })
        if(!unit) return null
        return adaptUnit(unit)

    }
    async getMany(companyId?: string): Promise<UnitModelResponse[]>{
        let units
        if(companyId){
            units = await prisma.unit.findMany({
                where:{
                    companyId
                },
                include:{
                    company:{
                        select:{
                            name: true
                        }
                    }
                }
            })
        }else{
            units = await prisma.unit.findMany({
                include:{
                    company:{
                        select:{
                            name: true
                        }
                    }
                }
            })
        }
        return units.map(unit => adaptUnit(unit))

    }
    async deleteById(id: string): Promise<boolean>{
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) return false
        try{
            await prisma.unit.delete({
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
    async update(id: string, {name, description}: UpdateUnitParams): Promise<UnitModelResponse | null>{
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) return null
        try{
            const unit = await prisma.unit.update({
                where:{
                    id: new ObjectId(id).toString()
                },
                data:{
                    name,
                    description
                },
                include:{
                    company:{
                        select:{
                            name: true
                        }
                    }
                }
            })
            return adaptUnit(unit)
        }catch(error: any){
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025')
                    return null
            }
            throw error
        }
    }
}