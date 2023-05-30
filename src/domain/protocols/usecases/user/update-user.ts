import { User, UserRoles } from "../../models/user";

// DECISION: User will only be able to update the company if it has role == SUPERADMIN.

export interface UpdateUserParams {
    name?: string;
    email?: string
    password?: string;
    company_id?: string
    role?: UserRoles
}

export interface UpdateUser {
    update: (user_id: string, data: UpdateUserParams) => Promise<User>
}
