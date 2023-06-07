import expressApp from '../../main/express/setup-express'

import { faker } from '@faker-js/faker'
import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { CodeAlreadyInUse } from '../../domain/errors'
import prisma from '../../infra/prisma/client'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('Create Company Tests', () => {
  describe('Given an Authenticated User', () => {
    let adminUser: FactoryUser,
      superAdminUser: FactoryUser,
      company: FactoryCompany,
      adminToken: string,
      superAdminToken: string
    beforeAll(async () => {
      company = await FactoryCompany.create({})
      adminUser = await FactoryUser.create({ companyId: company.id, role: UserRoles.Admin })
      adminToken = await adminUser.login()
      superAdminUser = await FactoryUser.create({ companyId: company.id, role: UserRoles.SuperAdmin })
      superAdminToken = await superAdminUser.login()
    })
    afterAll(async () => {
      await Promise.all([adminUser.delete(), superAdminUser.delete()])
      await company.delete()
    })
    describe('When he is a SuperAdmin',() => {
      describe('When sending all correct params', () => {
        it('should create a new company', async () => {
          const companyName = faker.person.fullName()
          const companyCode = faker.internet.password()
          const response = await request(expressApp).post('/company').send({
            name: companyName,
            code: companyCode
          }).set('Authorization', `Bearer ${superAdminToken}`)

          expect(response.statusCode).toBe(201)
          expect(response.body.name).toBe(companyName)
          expect(response.body.code).toBe(companyCode)

          await prisma.company.delete({ where: { id: response.body.id } })
        })
      })
      describe('When sending a code that is already being used', () => {
        let anotherCompany: FactoryCompany
        beforeAll(async () => {
          anotherCompany = await FactoryCompany.create({})
        })
        afterAll(async () => {
          await anotherCompany.delete()
        })
        it('should return a Code is Already being Used error', async () => {
          const companyName = faker.person.fullName()
          const response = await request(expressApp).post('/company').send({
            name: companyName,
            code: anotherCompany.code
          }).set('Authorization', `Bearer ${superAdminToken}`)

          expect(response.statusCode).toBe(400)
          expect(response.body.error).toBe(new CodeAlreadyInUse().message)
        })
      })
      describe('When not sending code/name', () => {
        it.skip('should return a bad request error', async () => {
          const response = await request(expressApp).post('/company').send({})
            .set('Authorization', `Bearer ${superAdminToken}`)

          expect(response.statusCode).toBe(400)
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      it('should return an forbidden error', async () => {
        const response = await request(expressApp).post('/company').send({
          name: faker.person.fullName(),
          code: faker.internet.password()
        }).set('Authorization', `Bearer ${adminToken}`)

        expect(response.statusCode).toBe(403)
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).post('/company').send({
        name: faker.person.fullName(),
        code: faker.internet.password()
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
