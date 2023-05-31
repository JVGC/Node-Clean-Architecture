import { CompanyModel } from "./company";

export interface Unit{
    id: string;
    name: string;
    description: string;
    company: CompanyModel;
}

export interface UnitModelResponse {
    name: string;
    description: string;
    companyName: string;
}