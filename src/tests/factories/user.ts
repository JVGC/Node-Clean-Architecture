import { faker } from '@faker-js/faker'
import { UserRoles } from '@prisma/client'
import { BcryptAdapter } from '../../infra/criptography/bcrypt'
import { JWTEncrypter } from '../../infra/criptography/jwt'
import prisma from '../../infra/prisma/client'

interface FactoryModel {
  id?: string
  name?: string
  email?: string
  password?: string
  role?: UserRoles
  companyId: string
}

export class FactoryUser {
  id: string
  name: string
  email: string
  companyId: string
  password: string
  role: UserRoles

  constructor (id: string, name: string, email: string, password: string, companyId: string, role: UserRoles) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.companyId = companyId
    this.role = role
  }

  static async create ({
    companyId,
    name = faker.person.fullName(),
    password = faker.internet.password(),
    email = faker.internet.email({ provider: 'tractian.com' }),
    role = UserRoles.SuperAdmin
  }: FactoryModel): Promise<FactoryUser> {
    const hasher = new BcryptAdapter(12)
    const hashedPassword = await hasher.hash(password)
    const prismaUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        companyId,
        Role: role
      }
    })

    return new FactoryUser(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      password,
      prismaUser.companyId,
      prismaUser.Role
    )
  }

  async delete (): Promise<void> {
    await prisma?.user.delete({
      where: {
        email: this.email
      }
    })
  }

  async login (): Promise<string> {
    const jwtEncrypter = new JWTEncrypter(process.env.JWT_SECRET ?? '')
    return jwtEncrypter.encrypt(this.id)
  }
}
