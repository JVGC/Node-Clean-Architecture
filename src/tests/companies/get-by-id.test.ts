import expressApp from '../../main/express/setup-express'

import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { CompanyNotFoundError } from '../../domain/errors'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('Get Company By ID Tests', () => {
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
      describe('And the company exists', () => {
        it('should return the company', async () => {
          const newCompany = await FactoryCompany.create({})
          const response = await request(expressApp).get(`/company/${newCompany.id}`)
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(newCompany.id)

          await newCompany.delete()
        })
      })
      describe('And the company does not exists', () => {
        it('should return a Company Not Found error', async () => {
          const response = await request(expressApp).delete('/company/123')
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new CompanyNotFoundError().message)
        })
      })
    })
    describe('When he is an Admin', () => {
      describe('And he tries to get information about its own company', () => {
        it('Should return the company', async () => {
          const response = await request(expressApp).get(`/company/${company.id}`)
            .set('Authorization', `Bearer ${adminUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(company.id)
        })
      })
      describe('And he tries to get information about another company', () => {
        it('should return a Company Not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const response = await request(expressApp).get(`/company/${anotherCompany.id}`)
            .set('Authorization', `Bearer ${adminUser.token}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new CompanyNotFoundError().message)

          await anotherCompany.delete()
        })
      })
    })
    describe('When he is an normal User', () => {
      it('should return an forbidden error', async () => {
        const response = await request(expressApp).get('/company/123')
          .set('Authorization', `Bearer ${normalUser.token}`)

        expect(response.statusCode).toBe(403)
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).get('/company/123')

      expect(response.statusCode).toBe(401)
    })
  })
})
