import { CompanyModel } from "./company"

export interface User{
    id: string
    name: string
    email: string
    password: string
    company: CompanyModel
    role: UserRoles
}

// DECISION: All users can CRUD Assets and Units. The different is that superAdmin can do that for different companies
export enum UserRoles{
    superAdmin = 'SuperAdmin', // DECISION: Can Create companies, and other user for different companies
    admin = 'Admin', // DECISION: Cannot create companies, and only can create users for its own company.
    user = 'User' // DECISION: Cannot get any information about other users, and other companies.
}