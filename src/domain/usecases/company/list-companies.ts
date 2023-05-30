import { Company } from "../../models/company";

export interface ListCompanies {
  list: () => Promise<Company[]>
}
