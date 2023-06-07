import expressApp from '../../main/express/setup-express'

import { faker } from '@faker-js/faker'
import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { AccessDeniedError, CompanyNotFoundError } from '../../domain/errors'
import prisma from '../../infra/prisma/client'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('Create User Tests', () => {
  describe('Given an Authenticated User', () => {
    let normalUser: FactoryUser,
      adminUser: FactoryUser,
      superAdminUser: FactoryUser,
      company: FactoryCompany

    beforeAll(async () => {
      company = await FactoryCompany.create({})

      const users = await Promise.all([
        FactoryUser.create({ companyId: company.id, role: UserRoles.User }),
        FactoryUser.create({ companyId: company.id, role: UserRoles.Admin }),
        FactoryUser.create({ companyId: company.id, role: UserRoles.SuperAdmin })
      ])
      normalUser = users[0]
      adminUser = users[1]
      superAdminUser = users[2]

      await Promise.all([
        normalUser.login(),
        adminUser.login(),
        superAdminUser.login()
      ])
    })
    afterAll(async () => {
      await Promise.all([normalUser.delete(), adminUser.delete(), superAdminUser.delete()])
      await company.delete()
    })
    describe('When he is a SuperAdmin',() => {
      describe('And he wants to create a Super Admin User', () => {
        it('should create a new user', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const userEmail = faker.internet.email({ provider: 'tractian.com' })
          const response = await request(expressApp).post('/user').send({
            name: faker.person.fullName(),
            email: userEmail,
            password: faker.internet.password(),
            role: UserRoles.SuperAdmin,
            companyId: anotherCompany.id
          }).set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(201)
          expect(response.body.email).toBe(userEmail)
          expect(response.body.role).toBe(UserRoles.SuperAdmin)
          expect(response.body.companyId).toBe(anotherCompany.id)
          expect(response.body.password).toBeFalsy()

          await prisma.user.delete({ where: { id: response.body.id } })
          await anotherCompany.delete()
        })
      })
      describe('And he wants to create a user for an another company', () => {
        it('should create a new user', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const userEmail = faker.internet.email({ provider: 'tractian.com' })
          const response = await request(expressApp).post('/user').send({
            name: faker.person.fullName(),
            email: userEmail,
            password: faker.internet.password(),
            role: UserRoles.Admin,
            companyId: anotherCompany.id
          }).set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(201)
          expect(response.body.email).toBe(userEmail)
          expect(response.body.role).toBe(UserRoles.Admin)
          expect(response.body.companyId).toBe(anotherCompany.id)
          expect(response.body.password).toBeFalsy()

          await prisma.user.delete({ where: { id: response.body.id } })
          await anotherCompany.delete()
        })
      })
      describe('And he sends an invalid email', () => {
        it.skip('should return a bad request error', async () => {
          const response = await request(expressApp).post('/user').send({
            name: faker.person.fullName(),
            email: faker.internet.email({ provider: 'tractian.com' }),
            password: faker.internet.password(),
            role: 'new role',
            companyId: '123'
          }).set('Authorization', `Bearer ${superAdminUser.token}`)
          expect(response.statusCode).toBe(400)
        })
      })
      describe('And he sends an invalid role', () => {
        it.skip('should return a bad request error', async () => {
          const response = await request(expressApp).post('/user').send({
            name: faker.person.fullName(),
            email: faker.internet.email({ provider: 'tractian.com' }),
            password: faker.internet.password(),
            role: 'new role',
            companyId: '123'
          }).set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(400)
        })
      })
      describe('And the company does not exist' , () => {
        it('should return a Company Not Found Error', async () => {
          const response = await request(expressApp).post('/user').send({
            name: faker.person.fullName(),
            email: faker.internet.email({ provider: 'tractian.com' }),
            password: faker.internet.password(),
            role: UserRoles.User,
            companyId: '123'
          }).set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(400)
          expect(response.body.error).toBe(new CompanyNotFoundError().message)
        })
      })
    })
    describe('When he is a Admin', () => {
      describe('And he wants to create a user for its own company', () => {
        describe('And it is an Admin user', () => {
          it('should create a new user', async () => {
            const userEmail = faker.internet.email({ provider: 'tractian.com' })
            const response = await request(expressApp).post('/user').send({
              name: faker.person.fullName(),
              email: userEmail,
              password: faker.internet.password(),
              role: UserRoles.Admin,
              companyId: company.id
            }).set('Authorization', `Bearer ${adminUser.token}`)

            expect(response.statusCode).toBe(201)
            expect(response.body.email).toBe(userEmail)
            expect(response.body.role).toBe(UserRoles.Admin)
            expect(response.body.companyId).toBe(company.id)
            expect(response.body.password).toBeFalsy()

            await prisma.user.delete({ where: { id: response.body.id } })
          })
        })
        describe('And it is a SuperAdmin user', () => {
          it('should return a access denied error', async () => {
            const userEmail = faker.internet.email({ provider: 'tractian.com' })
            const response = await request(expressApp).post('/user').send({
              name: faker.person.fullName(),
              email: userEmail,
              password: faker.internet.password(),
              role: UserRoles.SuperAdmin,
              companyId: company.id
            }).set('Authorization', `Bearer ${adminUser.token}`)

            expect(response.statusCode).toBe(403)
            expect(response.body.error).toBe(new AccessDeniedError().message)
          })
        })
      })
      describe('And he wants to create a user for another company', () => {
        it('should return a Company Not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const response = await request(expressApp).post('/user').send({
            name: faker.person.fullName(),
            email: faker.internet.email({ provider: 'tractian.com' }),
            password: faker.internet.password(),
            role: UserRoles.User,
            companyId: anotherCompany.id
          }).set('Authorization', `Bearer ${adminUser.token}`)

          expect(response.statusCode).toBe(400)
          expect(response.body.error).toBe(new CompanyNotFoundError().message)
          await anotherCompany.delete()
        })
      })
    })
    describe('When he is a Normal User', () => {
      it('should return an forbidden error', async () => {
        const response = await request(expressApp).post('/user').send({
          name: faker.person.fullName(),
          email: faker.internet.email({ provider: 'tractian.com' }),
          password: faker.internet.password(),
          role: UserRoles.User,
          companyId: faker.database.mongodbObjectId()
        }).set('Authorization', `Bearer ${normalUser.token}`)

        expect(response.statusCode).toBe(403)
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).post('/user').send({
        name: faker.person.fullName(),
        email: faker.internet.email({ provider: 'tractian.com' }),
        password: faker.internet.password(),
        role: UserRoles.User,
        companyId: faker.database.mongodbObjectId()
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
