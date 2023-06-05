import { Prisma } from '@prisma/client'
import { ObjectId } from 'mongodb'
import { type UserModelResponseWithPassword } from '../../../domain/models/user'
import { type UserRepository } from '../../../domain/protocols/repositories/user-repository'
import { type CreateUserParams } from '../../../domain/usecases/users/create-user'
import { type UpdateUserParams } from '../../../domain/usecases/users/update-user'
import { adaptUser } from '../adapters/user-adapter'
import prisma from '../client'

export class PrismaUserRepository implements UserRepository {
  async create ({ email, name, password, companyId, role }: CreateUserParams): Promise<UserModelResponseWithPassword> {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
        companyId,
        Role: role
      },
      include: {
        company: {
          select: {
            name: true
          }
        }
      }
    })

    return adaptUser(user)
  }

  async getById (id: string): Promise<UserModelResponseWithPassword | null> {
    const isIdValid = ObjectId.isValid(id)
    if (!isIdValid) return null
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      include: {
        company: {
          select: {
            name: true
          }
        }
      }
    })
    if (!user) return null
    return adaptUser(user)
  }

  async getByEmail (email: string): Promise<UserModelResponseWithPassword | null> {
    const user = await prisma.user.findUnique({
      where: {
        email
      },
      include: {
        company: {
          select: {
            name: true
          }
        }
      }
    })
    if (!user) return null
    return adaptUser(user)
  }

  async getMany (companyId?: string): Promise<UserModelResponseWithPassword[]> {
    let users
    if (companyId) {
      users = await prisma.user.findMany({
        where: {
          companyId
        },
        include: {
          company: {
            select: {
              name: true
            }
          }
        }
      })
    } else {
      users = await prisma.user.findMany({
        include: {
          company: {
            select: {
              name: true
            }
          }
        }
      })
    }
    return users.map(user => adaptUser(user))
  }

  async deleteById (id: string): Promise<boolean> {
    const isIdValid = ObjectId.isValid(id)
    if (!isIdValid) return false
    try {
      await prisma.user.delete({
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

  async update (id: string, { email, name, password, role }: UpdateUserParams): Promise<UserModelResponseWithPassword | null> {
    const isIdValid = ObjectId.isValid(id)
    if (!isIdValid) return null
    try {
      const user = await prisma.user.update({
        where: {
          id: new ObjectId(id).toString()
        },
        data: {
          email,
          name,
          password,
          Role: role
        },
        include: {
          company: {
            select: {
              name: true
            }
          }
        }
      })
      return adaptUser(user)
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') { return null }
      }
      throw error
    }
  }
}
