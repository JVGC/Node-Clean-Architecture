import { Company } from "../../models/company";

// DECISION: User will only be able to update the company if it has role == SUPERADMIN.

export interface UpdateCompanyParams {
    name?: string;
    code?: string;
}

export interface UpdateCompany {
    update: (company_id: string, data: UpdateCompanyParams) => Promise<Company>
}
