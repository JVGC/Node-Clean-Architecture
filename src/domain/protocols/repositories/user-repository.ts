import { UserModel } from "../../models/user";
import { CreateUserParams } from "../../usecases/users/create-user";
import { UpdateUserParams } from "../../usecases/users/update-user";

export interface UserRepository{
    create: (data: CreateUserParams) => Promise<UserModel>
    getById: (id: string) => Promise<UserModel | null>
    getByCode: (code: string) => Promise<UserModel | null>
    getMany: () => Promise<UserModel[]>
    deleteById: (id: string) => Promise<boolean>
    update: (id: string, updateData: UpdateUserParams) => Promise<UserModel | null>
}