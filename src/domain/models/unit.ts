import { Company } from "./company";

export interface Unit{
    id: string;
    name: string;
    description: string;
    company: Company;
}