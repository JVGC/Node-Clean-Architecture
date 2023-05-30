
// DUVIDA: What to do with the units and users that belongs to the company?
export interface DeleteCompanyById {
  delete: (company_id: string) => Promise<boolean>
}
