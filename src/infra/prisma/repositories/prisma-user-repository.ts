import { Prisma } from "@prisma/client";
import { ObjectId } from "mongodb";
import { UserRoles } from "../../../domain/models/user";
import { UserRepository } from "../../../domain/protocols/repositories/user-repository";
import { CreateUserParams, UserModelResponse } from "../../../domain/usecases/users/create-user";
import { UpdateUserParams } from "../../../domain/usecases/users/update-user";
import prisma from "../client";

export class PrismaUserRepository implements UserRepository{
    async create({email, name, password, companyId, role}: CreateUserParams): Promise<UserModelResponse>{
        const user = await prisma.user.create({
            data:{
                email,
                name,
                password,
                companyId: companyId,
                Role: role
            },
            include:{
                company:{
                    select:{
                        name: true
                    }
                }
            }
        })

        // TODO: Create a mapping between two objects
        return {
            ...user,
            role: UserRoles[user.Role],
            companyName: user.company.name
        }
    }
    async getById(id: string): Promise<UserModelResponse | null>{
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) return null
        const user = await prisma.user.findUnique({
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
        if(!user) return null
        return {
            ...user,
            role: UserRoles[user.Role],
            companyName: user.company.name
        }

    }
    async getByEmail(email: string): Promise<UserModelResponse | null>{
        const user = await prisma.user.findUnique({
            where:{
                email
            },
            include:{
                company:{
                    select:{
                        name: true
                    }
                }
            }
        })
        if(!user) return null
        return {
            ...user,
            role: UserRoles[user.Role],
            companyName: user.company.name
        }
    }
    async getMany(): Promise<UserModelResponse[]>{
        const users = await prisma.user.findMany({
            include:{
                company:{
                    select:{
                        name: true
                    }
                }
            }
        })
        return users.map(user => (
            {
                ...user,
                role: UserRoles[user.Role],
                companyName: user.company.name
            }
        ))

    }
    async deleteById(id: string): Promise<boolean>{
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) return false
        try{
            await prisma.user.delete({
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
    async update(id: string, {email, name, password, role}: UpdateUserParams): Promise<UserModelResponse | null>{
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) return null
        try{
            const user = await prisma.user.update({
                where:{
                    id: new ObjectId(id).toString()
                },
                data:{
                    email,
                    name,
                    password,
                    Role: role
                },
                include:{
                    company:{
                        select:{
                            name: true
                        }
                    }
                }
            })
            return {
                ...user,
                role: UserRoles[user.Role],
                companyName: user.company.name
            }
        }catch(error: any){
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025')
                    return null
            }
            throw error
        }
    }
}