import { faker } from '@faker-js/faker'
import prisma from '../../infra/prisma/client'

interface FactoryModel {
  name?: string
  code?: string
}

export class FactoryCompany {
  id: string
  name: string
  code: string
  constructor (id: string, name: string, code: string) {
    this.id = id
    this.name = name
    this.code = code
  }

  static async create ({
    name = faker.person.fullName(),
    code = faker.internet.password()
  }: FactoryModel): Promise<FactoryCompany> {
    const prismaCompany = await prisma.company.create({
      data: {
        name,
        code
      }
    })

    return new FactoryCompany(
      prismaCompany.id,
      prismaCompany.name,
      prismaCompany.code
    )
  }

  async delete (): Promise<void> {
    await prisma.company.delete({
      where: {
        code: this.code
      }
    })
  }
}
