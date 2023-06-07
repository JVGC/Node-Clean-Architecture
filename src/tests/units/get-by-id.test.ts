import expressApp from '../../main/express/setup-express'

import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { UnitNotFoundError } from '../../domain/errors'
import { FactoryCompany } from '../factories/company'
import { FactoryUnit } from '../factories/unit'
import { FactoryUser } from '../factories/user'

describe('Get Unit By Id Tests', () => {
  describe('Given an Authenticated User', () => {
    let normalUser: FactoryUser,
      superAdminUser: FactoryUser,
      company: FactoryCompany

    beforeAll(async () => {
      company = await FactoryCompany.create({})

      const users = await Promise.all([
        FactoryUser.create({ companyId: company.id, role: UserRoles.User }),
        FactoryUser.create({ companyId: company.id, role: UserRoles.SuperAdmin })]
      )
      normalUser = users[0]
      superAdminUser = users[1]

      await Promise.all([normalUser.login(), superAdminUser.login()])
    })
    afterAll(async () => {
      await Promise.all([normalUser.delete(), superAdminUser.delete()])
      await company.delete()
    })
    describe('When he is a SuperAdmin', () => {
      describe('And he wants to get a Unit of Another Company', () => {
        it('should delete the Unit', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).get(`/unit/${unitFromAnotherCompany.id}`)
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(unitFromAnotherCompany.id)

          await unitFromAnotherCompany.delete()
          await anotherCompany.delete()
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      describe('And he wants to get a unit from another company', () => {
        it('Should return a Unit not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).get(`/unit/${unitFromAnotherCompany.id}`)
            .set('Authorization', `Bearer ${normalUser.token}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new UnitNotFoundError().message)

          await unitFromAnotherCompany.delete()
          await anotherCompany.delete()
        })
      })
      describe('When he wants to get a unit from its own company', () => {
        describe('When the unit does not exist', () => {
          it('should return a Unit Not Find error', async () => {
            const response = await request(expressApp).get('/unit/123')
              .set('Authorization', `Bearer ${normalUser.token}`)

            expect(response.statusCode).toBe(404)
            expect(response.body.error).toBe(new UnitNotFoundError().message)
          })
        })
        describe('When the unit exist', () => {
          it('should get the Unit', async () => {
            const unit = await FactoryUnit.create({ companyId: company.id })
            const response = await request(expressApp).get(`/unit/${unit.id}`)
              .set('Authorization', `Bearer ${normalUser.token}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.id).toBe(unit.id)

            await unit.delete()
          })
        })
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).get('/unit/123')

      expect(response.statusCode).toBe(401)
    })
  })
})
