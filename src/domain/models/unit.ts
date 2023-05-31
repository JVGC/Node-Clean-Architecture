import { CompanyModel } from "./company";

export interface Unit{
    id: string;
    name: string;
    description: string;
    company: CompanyModel;
}