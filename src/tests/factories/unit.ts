import { faker } from '@faker-js/faker'
import prisma from '../../infra/prisma/client'

interface FactoryModel {
  name?: string
  description?: string
  companyId: string
}

export class FactoryUnit {
  id: string
  name: string
  description: string
  companyId: string

  constructor (id: string, name: string, description: string, companyId: string) {
    this.id = id
    this.name = name
    this.description = description
    this.companyId = companyId
  }

  static async create ({
    name = faker.commerce.product(),
    description = faker.internet.password(),
    companyId
  }: FactoryModel): Promise<FactoryUnit> {
    const prismaUnit = await prisma.unit.create({
      data: {
        name,
        description,
        companyId
      }
    })

    return new FactoryUnit(
      prismaUnit.id,
      prismaUnit.name,
      prismaUnit.description,
      prismaUnit.companyId
    )
  }

  async delete (): Promise<void> {
    await prisma.unit.delete({
      where: {
        id: this.id
      }
    })
  }
}
