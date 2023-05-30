import { User, UserRoles } from "../../models/user";

export interface CreateUserParams {
    name: string;
    email: string
    password: string;
    passwordConfirmation: string;
    company_id: string;
    role: UserRoles
}

export interface CreateUser {
    create: (data: CreateUserParams) => Promise<User>
}
