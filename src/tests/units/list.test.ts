import { UserRoles } from '@prisma/client'
import expressApp from '../../main/express/setup-express'

import request from 'supertest'
import { FactoryCompany } from '../factories/company'
import { FactoryUnit } from '../factories/unit'
import { FactoryUser } from '../factories/user'

describe('List Units Tests', () => {
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
      it('should return all the units in the database', async () => {
        const anotherCompany = await FactoryCompany.create({})
        const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })

        const unit = await FactoryUnit.create({ companyId: company.id })
        const response = await request(expressApp).get('/unit')
          .set('Authorization', `Bearer ${superAdminUser.token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(2)
        expect(response.body[0].id).toBe(unitFromAnotherCompany.id)
        expect(response.body[1].id).toBe(unit.id)

        await unitFromAnotherCompany.delete()
        await anotherCompany.delete()
        await unit.delete()
      })
    })
    describe('When he is not a SuperAdmin', () => {
      it('Should return only the units from its own company', async () => {
        const anotherCompany = await FactoryCompany.create({})
        const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })

        const unit = await FactoryUnit.create({ companyId: company.id })
        const response = await request(expressApp).get('/unit')
          .set('Authorization', `Bearer ${normalUser.token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(1)
        expect(response.body[0].id).toBe(unit.id)

        await unitFromAnotherCompany.delete()
        await anotherCompany.delete()
        await unit.delete()
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).get('/unit')

      expect(response.statusCode).toBe(401)
    })
  })
})
