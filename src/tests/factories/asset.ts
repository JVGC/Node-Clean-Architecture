import { faker } from '@faker-js/faker'
import { AssetStatus } from '@prisma/client'
import prisma from '../../infra/prisma/client'

interface FactoryModel {
  name?: string
  description?: string
  model?: string
  owner?: string
  status?: AssetStatus
  healthLevel?: number
  imageURL?: string
  unitId: string
}

export class FactoryAsset {
  id: string
  name: string
  description: string
  model: string
  owner: string
  status: AssetStatus
  healthLevel: number
  imageURL?: string

  unitId: string

  constructor (id: string, name: string, description: string,
    model: string, owner: string, status: AssetStatus,
    healthLevel: number, imageURL: string, unitId: string
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.unitId = unitId
    this.model = model
    this.owner = owner
    this.status = status
    this.healthLevel = healthLevel
    this.imageURL = imageURL
  }

  static async create ({
    name = faker.commerce.product(),
    description = faker.internet.password(),
    model = faker.vehicle.model(),
    owner = faker.company.name(),
    status = AssetStatus.Running,
    healthLevel = 100,
    imageURL = faker.image.url(),
    unitId
  }: FactoryModel): Promise<FactoryAsset> {
    const prismaUnit = await prisma.asset.create({
      data: {
        name,
        description,
        model,
        owner,
        status,
        healthLevel,
        imageURL,
        unitId
      }
    })

    return new FactoryAsset(
      prismaUnit.id,
      prismaUnit.name,
      prismaUnit.description,
      prismaUnit.model,
      prismaUnit.owner,
      prismaUnit.status,
      prismaUnit.healthLevel,
      prismaUnit.imageURL ?? '',
      prismaUnit.unitId
    )
  }

  async delete (): Promise<void> {
    await prisma.asset.delete({
      where: {
        id: this.id
      }
    })
  }
}
