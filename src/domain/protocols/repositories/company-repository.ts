import { Company } from "../../models/company";
import { CreateCompanyParams } from "../usecases/company/create-company";

export interface CompanyRepository{
    create: (data: CreateCompanyParams) => Promise<Company>
}