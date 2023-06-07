import { UserRoles } from '@prisma/client'
import { AssetNotFoundError } from '../../domain/errors'
import expressApp from '../../main/express/setup-express'

import request from 'supertest'
import { FactoryAsset } from '../factories/asset'
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
      describe('And he wants to get an Asset of Another Company', () => {
        it('should get the Asset', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const assetFromAnotherCompanyUnit = await FactoryAsset.create({ unitId: unitFromAnotherCompany.id })

          const response = await request(expressApp).get(`/asset/${assetFromAnotherCompanyUnit.id}`)
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(assetFromAnotherCompanyUnit.id)

          await assetFromAnotherCompanyUnit.delete()
          await unitFromAnotherCompany.delete()
          await anotherCompany.delete()
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      describe('And he wants to get an asset of another company', () => {
        it('Should return an Asset not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const assetFromAnotherCompanyUnit = await FactoryAsset.create({ unitId: unitFromAnotherCompany.id })

          const response = await request(expressApp).get(`/asset/${assetFromAnotherCompanyUnit.id}`)
            .set('Authorization', `Bearer ${normalUser.token}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new AssetNotFoundError().message)

          await assetFromAnotherCompanyUnit.delete()
          await unitFromAnotherCompany.delete()
          await anotherCompany.delete()
        })
      })
      describe('When he wants to get an asset from its own company', () => {
        describe('When the asset does not exist', () => {
          it('should return an Asset Not Find error', async () => {
            const response = await request(expressApp).get('/asset/123')
              .set('Authorization', `Bearer ${normalUser.token}`)

            expect(response.statusCode).toBe(404)
            expect(response.body.error).toBe(new AssetNotFoundError().message)
          })
        })
        describe('When the asset exists', () => {
          it('should get the Asset', async () => {
            const unit = await FactoryUnit.create({ companyId: company.id })
            const asset = await FactoryAsset.create({ unitId: unit.id })

            const response = await request(expressApp).get(`/asset/${asset.id}`)
              .set('Authorization', `Bearer ${normalUser.token}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.id).toBe(asset.id)

            await asset.delete()
            await unit.delete()
          })
        })
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).get('/asset/123')

      expect(response.statusCode).toBe(401)
    })
  })
})
