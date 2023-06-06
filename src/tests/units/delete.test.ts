import expressApp from '../../main/express/setup-express'

import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { UnitNotFoundError } from '../../domain/errors'
import prisma from '../../infra/prisma/client'
import { FactoryCompany } from '../factories/company'
import { FactoryUnit } from '../factories/unit'
import { FactoryUser } from '../factories/user'

describe('Delete Unit Tests', () => {
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
    describe('When he is a SuperAdmin', () => {
      describe('And he wants to delete a Unit of Another Company', () => {
        it('should delete the Unit', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).delete(`/unit/${unitFromAnotherCompany.id}`)
            .set('Authorization', `Bearer ${superAdminToken}`)

          expect(response.statusCode).toBe(204)
          const findUnit = await prisma.unit.findUnique({ where: { id: unitFromAnotherCompany.id } })
          expect(findUnit).toBeNull()

          await anotherCompany.delete()
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      describe('And he wants to delete a unit from another company', () => {
        it('Should return a Unit not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).delete(`/unit/${unitFromAnotherCompany.id}`)
            .set('Authorization', `Bearer ${normalUserToken}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new UnitNotFoundError().message)

          await unitFromAnotherCompany.delete()
          await anotherCompany.delete()
        })
      })
      describe('When he wants to delete a unit from its own company', () => {
        describe('When the unit does not exist', () => {
          it('should return a Unit Not Find error', async () => {
            const response = await request(expressApp).delete('/unit/123')
              .set('Authorization', `Bearer ${normalUserToken}`)

            expect(response.statusCode).toBe(404)
            expect(response.body.error).toBe(new UnitNotFoundError().message)
          })
        })
        describe('When the unit exist', () => {
          it('should delete the Unit', async () => {
            const unit = await FactoryUnit.create({ companyId: company.id })
            const response = await request(expressApp).delete(`/unit/${unit.id}`)
              .set('Authorization', `Bearer ${normalUserToken}`)

            expect(response.statusCode).toBe(204)
            const findUnit = await prisma.unit.findUnique({ where: { id: unit.id } })
            expect(findUnit).toBeNull()
          })
        })
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).delete('/unit/123')

      expect(response.statusCode).toBe(401)
    })
  })
})
