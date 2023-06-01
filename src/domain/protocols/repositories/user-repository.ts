import { UserModelResponseWithPassword } from "../../models/user";
import { CreateUserParams } from "../../usecases/users/create-user";
import { UpdateUserParams } from "../../usecases/users/update-user";


export interface UserRepository{
    create: (data: CreateUserParams) => Promise<UserModelResponseWithPassword>
    getById: (id: string) => Promise<UserModelResponseWithPassword | null>
    getByEmail: (email: string) => Promise<UserModelResponseWithPassword | null>
    getMany: () => Promise<UserModelResponseWithPassword[]>
    deleteById: (id: string) => Promise<boolean>
    update: (id: string, updateData: UpdateUserParams) => Promise<UserModelResponseWithPassword | null>
}