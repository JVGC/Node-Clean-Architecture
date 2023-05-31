import { Company } from "../../models/company";
import { CreateCompanyParams } from "../../usecases/create-company-usecase";

export interface CompanyRepository{
    create: (data: CreateCompanyParams) => Promise<Company>
}