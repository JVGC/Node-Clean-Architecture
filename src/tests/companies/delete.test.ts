import expressApp from '../../main/express/setup-express'

import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { CompanyNotFoundError } from '../../domain/errors'
import prisma from '../../infra/prisma/client'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('Delete Company Tests', () => {
  describe('Given an Authenticated User', () => {
    let normalUser: FactoryUser,
      superAdminUser: FactoryUser,
      company: FactoryCompany,
      normalUserToken: string,
      superAdminToken: string
    beforeAll(async () => {
      company = await FactoryCompany.create({})
      normalUser = await FactoryUser.create({ companyId: company.id, role: UserRoles.User })
      normalUserToken = await normalUser.login()
      superAdminUser = await FactoryUser.create({ companyId: company.id, role: UserRoles.SuperAdmin })
      superAdminToken = await superAdminUser.login()
    })
    afterAll(async () => {
      await normalUser.delete()
      await superAdminUser.delete()
      await company.delete()
    })
    describe('When he is a SuperAdmin',() => {
      describe('And the company exists', () => {
        it('should delete the company', async () => {
          const companyToBeDeleted = await FactoryCompany.create({})
          const response = await request(expressApp).delete(`/company/${companyToBeDeleted.id}`)
            .set('Authorization', `Bearer ${superAdminToken}`)

          expect(response.statusCode).toBe(204)
          const findCompany = await prisma.company.findUnique({
            where: {
              id: companyToBeDeleted.id
            }
          })
          expect(findCompany).toBeNull()
        })
      })
      describe('And the company does not exists', () => {
        it('should return a Company Not Found error', async () => {
          const response = await request(expressApp).delete('/company/123')
            .set('Authorization', `Bearer ${superAdminToken}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new CompanyNotFoundError().message)
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      it('should return an forbidden error', async () => {
        const response = await request(expressApp).delete('/company/123')
          .set('Authorization', `Bearer ${normalUserToken}`)

        expect(response.statusCode).toBe(403)
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).delete('/company/123')

      expect(response.statusCode).toBe(401)
    })
  })
})
