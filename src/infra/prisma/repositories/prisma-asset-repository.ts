import { Prisma } from '@prisma/client'
import { ObjectId } from 'mongodb'
import { type AssetModelResponse } from '../../../domain/models/asset'
import { type AssetRepository } from '../../../domain/protocols/repositories/asset-repository'
import { type CreateAssetParams } from '../../../domain/usecases/asset/create-asset'
import { type UpdateAssetParams } from '../../../domain/usecases/asset/update-asset'
import { adaptAsset } from '../adapters/asset-adapter'
import prisma from '../client'

export class PrismaAssetRepository implements AssetRepository {
  async create ({ name, unitId, description, model, owner }: CreateAssetParams): Promise<AssetModelResponse> {
    const asset = await prisma.asset.create({
      data: {
        name,
        description,
        unitId,
        model,
        owner,
        healthLevel: 100
      },
      include: {
        unit: {
          select: {
            name: true,
            company: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })

    return adaptAsset(asset)
  }

  async getById (id: string): Promise<AssetModelResponse | null> {
    const isIdValid = ObjectId.isValid(id)
    if (!isIdValid) return null
    const asset = await prisma.asset.findUnique({
      where: {
        id
      },
      include: {
        unit: {
          select: {
            name: true,
            company: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })
    if (!asset) return null
    return adaptAsset(asset)
  }

  async getMany (companyId?: string): Promise<AssetModelResponse[]> {
    let whereClause: object = {}
    if (companyId) {
      whereClause = {
        unit: {
          companyId
        }
      }
    }
    const assets = await prisma.asset.findMany({
      where: whereClause,
      include: {
        unit: {
          select: {
            name: true,
            company: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })
    return assets.map(asset => adaptAsset(asset))
  }

  async deleteById (id: string): Promise<boolean> {
    const isIdValid = ObjectId.isValid(id)
    if (!isIdValid) return false
    try {
      await prisma.asset.delete({
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

  async update (id: string, { name, description, healthLevel, model, owner, status, unitId }: UpdateAssetParams): Promise<AssetModelResponse | null> {
    const isIdValid = ObjectId.isValid(id)
    if (!isIdValid) return null
    try {
      const asset = await prisma.asset.update({
        where: {
          id: new ObjectId(id).toString()
        },
        data: {
          name,
          description,
          healthLevel,
          model,
          owner,
          status,
          unitId
        },
        include: {
          unit: {
            select: {
              name: true,
              company: {
                select: {
                  id: true
                }
              }
            }
          }
        }
      })
      return adaptAsset(asset)
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') { return null }
      }
      throw error
    }
  }
}
