import expressApp from '../../main/express/setup-express'

import { faker } from '@faker-js/faker'
import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { CompanyNotFoundError } from '../../domain/errors'
import prisma from '../../infra/prisma/client'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('Create Unit Tests', () => {
  describe('Given an Authenticated User', () => {
    let normalUser: FactoryUser,
      superAdminUser: FactoryUser,
      company: FactoryCompany,
      normalUserToken: string,
      superAdminToken: string

    beforeAll(async () => {
      company = await FactoryCompany.create({})

      const users = await Promise.all([
        FactoryUser.create({ companyId: company.id, role: UserRoles.User }),
        FactoryUser.create({ companyId: company.id, role: UserRoles.SuperAdmin })]
      )
      normalUser = users[0]
      superAdminUser = users[1]

      const tokens = await Promise.all([normalUser.login(), superAdminUser.login()])
      normalUserToken = tokens[0]
      superAdminToken = tokens[1]
    })
    afterAll(async () => {
      await Promise.all([normalUser.delete(), superAdminUser.delete()])
      await company.delete()
    })
    describe('When he is a SuperAdmin', () => {
      describe('And he wants to create a Unit for Another Company', () => {
        it('should create the Unit', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const name = faker.commerce.product()
          const description = faker.commerce.productDescription()
          const response = await request(expressApp).post('/unit').send({
            name,
            description ,
            companyId: anotherCompany.id
          }).set('Authorization', `Bearer ${superAdminToken}`)

          expect(response.statusCode).toBe(201)
          expect(response.body.id).toBeTruthy()
          expect(response.body.name).toBe(name)
          expect(response.body.description).toBe(description)
          expect(response.body.companyId).toBe(anotherCompany.id)

          await prisma.unit.delete({ where: { id: response.body.id } })
          await anotherCompany.delete()
        })
      })
      describe('And he sent invalid params', () => {
        it.skip('should return a bad request error', async () => {
          const response = await request(expressApp).post('/unit').send({
            name: false,
            description: [],
            companyId: company.id
          }).set('Authorization', `Bearer ${superAdminToken}`)

          expect(response.statusCode).toBe(400)
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      describe('And he wants to create a unit for another company', () => {
        it('Should return a Company not Found error', async () => {
          const response = await request(expressApp).post('/unit').send({
            name: faker.person.fullName(),
            description: faker.commerce.productDescription() ,
            companyId: faker.database.mongodbObjectId()
          }).set('Authorization', `Bearer ${normalUserToken}`)

          expect(response.statusCode).toBe(400)
          expect(response.body.error).toBe(new CompanyNotFoundError().message)
        })
      })
      describe('When he wants to create a unit his own company', () => {
        it('should create the Unit', async () => {
          const name = faker.commerce.product()
          const description = faker.commerce.productDescription()
          const response = await request(expressApp).post('/unit').send({
            name,
            description ,
            companyId: company.id
          }).set('Authorization', `Bearer ${normalUserToken}`)

          expect(response.statusCode).toBe(201)
          expect(response.body.id).toBeTruthy()
          expect(response.body.name).toBe(name)
          expect(response.body.description).toBe(description)
          expect(response.body.companyId).toBe(company.id)

          await prisma.unit.delete({ where: { id: response.body.id } })
        })
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).post('/unit').send({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription() ,
        companyId: faker.database.mongodbObjectId()
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
