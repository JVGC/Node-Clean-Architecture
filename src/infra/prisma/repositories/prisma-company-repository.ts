import { Prisma } from '@prisma/client'
import { ObjectId } from 'mongodb'
import { type CompanyModel } from '../../../domain/models/company'
import { type CompanyRepository } from '../../../domain/protocols/repositories/company-repository'
import { type CreateCompanyParams } from '../../../domain/usecases/companies/create-company'
import { type UpdateCompanyParams } from '../../../domain/usecases/companies/update-company'
import { adaptCompany } from '../adapters/company-adapter'
import prisma from '../client'

export class PrismaCompanyRepository implements CompanyRepository {
  async update (id: string, { code, name }: UpdateCompanyParams): Promise<CompanyModel | null> {
    const isIdValid = ObjectId.isValid(id)
    if (!isIdValid) return null
    try {
      const company = await prisma.company.update({
        where: {
          id: new ObjectId(id).toString()
        },
        data: {
          name,
          code
        }
      })
      return adaptCompany(company)
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') { return null }
      }
      throw error
    }
  }

  // TODO: Impletement Soft Delete
  async deleteById (id: string): Promise<boolean> {
    const isIdValid = ObjectId.isValid(id)
    if (!isIdValid) return false
    try {
      await prisma.company.delete({
        where: {
          id: new ObjectId(id).toString()
        }
      })
      return true
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') { return false }
      }
      throw error
    }
  }

  async getMany (): Promise<CompanyModel[]> {
    const companies = await prisma.company.findMany()
    return companies.map(company => adaptCompany(company))
  }

  async getByCode (code: string): Promise<CompanyModel | null> {
    const company = await prisma.company.findUnique({
      where: {
        code
      }
    })
    if (!company) return null
    return adaptCompany(company)
  }

  async getById (id: string): Promise<CompanyModel | null> {
    const isIdValid = ObjectId.isValid(id)
    if (!isIdValid) return null
    const company = await prisma.company.findUnique({
      where: {
        id: new ObjectId(id).toString()
      }
    })
    if (!company) return null
    return adaptCompany(company)
  }

  async create ({ code, name }: CreateCompanyParams): Promise<CompanyModel> {
    const company = await prisma.company.create({
      data: {
        name,
        code
      }
    })

    return adaptCompany(company)
  }
}
