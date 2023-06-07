import { UserRoles } from '@prisma/client'
import expressApp from '../../main/express/setup-express'

import request from 'supertest'
import { FactoryAsset } from '../factories/asset'
import { FactoryCompany } from '../factories/company'
import { FactoryUnit } from '../factories/unit'
import { FactoryUser } from '../factories/user'

describe('List Assets Tests', () => {
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
      await Promise.all([normalUser.delete(), superAdminUser.delete()])
      await company.delete()
    })
    describe('When he is a SuperAdmin', () => {
      it('should return all the assets in the database', async () => {
        const anotherCompany = await FactoryCompany.create({})
        const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
        const assetFromAnotherCompanyUnit = await FactoryAsset.create({ unitId: unitFromAnotherCompany.id })

        const unit = await FactoryUnit.create({ companyId: company.id })
        const assetFromOwnCompany = await FactoryAsset.create({ unitId: unit.id })
        const response = await request(expressApp).get('/asset')
          .set('Authorization', `Bearer ${superAdminToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(2)
        expect(response.body[0].id).toBe(assetFromAnotherCompanyUnit.id)
        expect(response.body[1].id).toBe(assetFromOwnCompany.id)

        await assetFromAnotherCompanyUnit.delete()
        await unitFromAnotherCompany.delete()
        await anotherCompany.delete()
        await assetFromOwnCompany.delete()
        await unit.delete()
      })
    })
    describe('When he is not a SuperAdmin', () => {
      it('Should return only the assets from its own company', async () => {
        const anotherCompany = await FactoryCompany.create({})
        const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
        const assetFromAnotherCompanyUnit = await FactoryAsset.create({ unitId: unitFromAnotherCompany.id })

        const unit = await FactoryUnit.create({ companyId: company.id })
        const assetFromOwnCompany = await FactoryAsset.create({ unitId: unit.id })

        const response = await request(expressApp).get('/asset')
          .set('Authorization', `Bearer ${normalUserToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(1)
        expect(response.body[0].id).toBe(assetFromOwnCompany.id)

        await assetFromAnotherCompanyUnit.delete()
        await unitFromAnotherCompany.delete()
        await anotherCompany.delete()
        await assetFromOwnCompany.delete()
        await unit.delete()
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).get('/asset')

      expect(response.statusCode).toBe(401)
    })
  })
})
