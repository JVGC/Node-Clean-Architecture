import { User } from "../../../domain/models/user";
import { UserRepository } from "../../../domain/protocols/repositories/user-repository";
import { CreateUserParams } from "../../../domain/usecases/users/create-user";
import { UpdateUserParams } from "../../../domain/usecases/users/update-user";

export class PrismaUserRepository implements UserRepository{
    async create(data: CreateUserParams): Promise<User>{

    }
    async getById(id: string): Promise<User | null>{

    }
    async getByCode(code: string): Promise<User | null>{

    }
    async getMany(): Promise<User[]>{

    }
    async deleteById(id: string): Promise<boolean>{

    }
    async update(id: string, updateData: UpdateUserParams): Promise<User | null>{

    }