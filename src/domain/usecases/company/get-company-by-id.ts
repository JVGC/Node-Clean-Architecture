import { Company } from "../../models/company";

export interface GetCompanyById {
  get: (company_id: string) => Promise<Company>
}
