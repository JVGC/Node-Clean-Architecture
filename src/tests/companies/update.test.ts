import expressApp from '../../main/express/setup-express'

import { faker } from '@faker-js/faker'
import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { CodeAlreadyInUse, CompanyNotFoundError } from '../../domain/errors'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('Update Company Tests', () => {
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
      await adminUser.delete()
      await superAdminUser.delete()
      await company.delete()
    })
    describe('When he is a SuperAdmin',() => {
      describe('And the company does not exist', () => {
        it('should return a Company Not Found Error', async () => {
          const response = await request(expressApp).patch('/company/123')
            .set('Authorization', `Bearer ${superAdminToken}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new CompanyNotFoundError().message)
        })
      })
      describe('And the company exist', () => {
        describe('When sending all correct params', () => {
          it('should update the company', async () => {
            const newCompanyName = faker.person.fullName()
            const response = await request(expressApp).patch(`/company/${company.id}`).send({
              name: newCompanyName
            }).set('Authorization', `Bearer ${superAdminToken}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.name).toBe(newCompanyName)
            expect(response.body.code).toBe(company.code)
          })
        })
        describe('When sending a code that is already being used by another company', () => {
          it('should return a Code is Already being Used error', async () => {
            const anotherCompany = await FactoryCompany.create({})
            const response = await request(expressApp).patch(`/company/${company.id}`).send({
              code: anotherCompany.code
            }).set('Authorization', `Bearer ${superAdminToken}`)

            expect(response.statusCode).toBe(400)
            expect(response.body.error).toBe(new CodeAlreadyInUse().message)

            await anotherCompany.delete()
          })
        })
        describe('When sending a code that is already being used but it is the own company', () => {
          it('should update normally', async () => {
            const anotherCompany = await FactoryCompany.create({})
            const response = await request(expressApp).patch(`/company/${anotherCompany.id}`).send({
              code: anotherCompany.code
            }).set('Authorization', `Bearer ${superAdminToken}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.id).toBe(anotherCompany.id)
            expect(response.body.name).toBe(anotherCompany.name)
            expect(response.body.code).toBe(anotherCompany.code)

            await anotherCompany.delete()
          })
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      it('should return an forbidden error', async () => {
        const response = await request(expressApp).patch(`/company/${company.id}`).send({
          name: faker.person.fullName(),
          code: faker.internet.password()
        }).set('Authorization', `Bearer ${adminToken}`)

        expect(response.statusCode).toBe(403)
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).patch('/company/123').send({
        name: faker.person.fullName(),
        code: faker.internet.password()
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
