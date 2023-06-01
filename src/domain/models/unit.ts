import { CompanyModel } from "./company";

export interface Unit{
    id: string;
    name: string;
    description: string;
    company: CompanyModel;
}

export interface UnitModelResponse {
    id: string;
    name: string;
    description: string;
    companyName: string;
    companyId: string;
}