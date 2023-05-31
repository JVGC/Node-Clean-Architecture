import { User } from "../../models/user";
import { CreateUserParams } from "../../usecases/users/create-user";
import { UpdateUserParams } from "../../usecases/users/update-user";

export interface UserRepository{
    create: (data: CreateUserParams) => Promise<User>
    getById: (id: string) => Promise<User | null>
    getByCode: (code: string) => Promise<User | null>
    getMany: () => Promise<User[]>
    deleteById: (id: string) => Promise<boolean>
    update: (id: string, updateData: UpdateUserParams) => Promise<User | null>
}