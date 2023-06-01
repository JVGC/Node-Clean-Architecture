import { CompanyModel } from "./company"

export interface UserModel{
    id: string
    name: string
    email: string
    password: string
    company: CompanyModel
    role: UserRoles
}

// DECISION: All users can CRUD Assets and Units. The different is that superAdmin can do that for different companies
export enum UserRoles{
    SuperAdmin = 'SuperAdmin', // DECISION: Can Create companies, and other user for different companies
    Admin = 'Admin', // DECISION: Cannot create companies, and only can create users for its own company.
    User = 'User' // DECISION: Cannot get any information about other users, and other companies.
}

export interface UserModelResponse {
    id: string;
    name: string;
    email: string
    companyId: string;
    companyName: string;
    role: UserRoles
}

export type UserModelResponseWithPassword =  UserModelResponse &{
    password?: string;
}