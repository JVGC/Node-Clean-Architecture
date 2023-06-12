import { type CompanyModel } from '../../models/company'
import { type CreateCompanyParams } from '../../usecases/companies/create-company'
import { type UpdateCompanyParams } from '../../usecases/companies/update-company'

export interface CompanyRepository {
  create: (data: CreateCompanyParams) => Promise<CompanyModel>
  getById: (id: string) => Promise<CompanyModel | null>
  getByCode: (code: string) => Promise<CompanyModel | null>
  getMany: () => Promise<CompanyModel[]>
  deleteById: (id: string) => Promise<boolean>
  update: (id: string, updateData: UpdateCompanyParams) => Promise<CompanyModel | null>
}
