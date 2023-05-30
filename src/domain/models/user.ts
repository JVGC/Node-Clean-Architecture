import { Company } from "./company"

export interface User{
    id: string
    name: string
    email: string
    password: string
    company: Company
}