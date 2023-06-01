import { Company } from "@prisma/client";
import { CompanyModel } from "../../../domain/models/company";


export const adaptCompany = (company: Company): CompanyModel => {
    return {
        id: company.id,
        name: company.name,
        code: company.code
    }
}