import { faker } from '@faker-js/faker'
import { UserRoles } from '@prisma/client'
import { BcryptAdapter } from '../../infra/criptography/bcrypt'
import prisma from '../../infra/prisma/client'

interface FactoryModel {
  name?: string
  email?: string
  password?: string
  role?: UserRoles
  companyId: string
}

export class FactoryUser {
  name: string
  email: string
  companyId: string
  password: string
  role: UserRoles

  constructor (name: string, email: string, password: string, companyId: string, role: UserRoles) {
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
    email = faker.internet.email({ firstName: '', lastName: '', provider: 'tractian.com' }),
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
}
