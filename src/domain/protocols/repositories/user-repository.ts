import { CreateUserParams, UserModelResponse } from "../../usecases/users/create-user";
import { UpdateUserParams } from "../../usecases/users/update-user";


export interface UserRepository{
    create: (data: CreateUserParams) => Promise<UserModelResponse>
    getById: (id: string) => Promise<UserModelResponse | null>
    getByEmail: (email: string) => Promise<UserModelResponse | null>
    getMany: () => Promise<UserModelResponse[]>
    deleteById: (id: string) => Promise<boolean>
    update: (id: string, updateData: UpdateUserParams) => Promise<UserModelResponse | null>
}