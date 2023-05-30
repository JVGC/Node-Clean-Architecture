import { Company } from "../../models/company";

export interface CreateCompanyParams {
    name: string;
    code: string;
}

export interface CreateCompany {
    create: (data: CreateCompanyParams) => Promise<Company>
}
