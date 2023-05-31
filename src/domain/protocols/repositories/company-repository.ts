import { CompanyModel } from "../../models/company";
import { CreateCompanyParams } from "../../usecases/create-company-usecase";

export interface CompanyRepository{
    create: (data: CreateCompanyParams) => Promise<CompanyModel>
    getById: (id: string) => Promise<CompanyModel | null>
    getByCode: (code: string) => Promise<CompanyModel | null>
}