import { UserRoles } from '@prisma/client'
import { AssetNotFoundError } from '../../domain/errors'
import prisma from '../../infra/prisma/client'
import expressApp from '../../main/express/setup-express'

import request from 'supertest'
import { FactoryAsset } from '../factories/asset'
import { FactoryCompany } from '../factories/company'
import { FactoryUnit } from '../factories/unit'
import { FactoryUser } from '../factories/user'

describe('Delete Asset Tests', () => {
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
      describe('And he wants to delete a Asset of Another Company', () => {
        it('should delete the Asset', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const AssetFromAnotherCompanyUnit = await FactoryAsset.create({ unitId: unitFromAnotherCompany.id })

          const response = await request(expressApp).delete(`/asset/${AssetFromAnotherCompanyUnit.id}`)
            .set('Authorization', `Bearer ${superAdminToken}`)

          expect(response.statusCode).toBe(204)
          const findAsset = await prisma.asset.findUnique({ where: { id: AssetFromAnotherCompanyUnit.id } })
          expect(findAsset).toBeNull()

          await unitFromAnotherCompany.delete()
          await anotherCompany.delete()
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      describe('And he wants to delete an asset from another company', () => {
        it('Should return a Asset not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const AssetFromAnotherCompanyUnit = await FactoryAsset.create({ unitId: unitFromAnotherCompany.id })

          const response = await request(expressApp).delete(`/asset/${AssetFromAnotherCompanyUnit.id}`)
            .set('Authorization', `Bearer ${normalUserToken}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new AssetNotFoundError().message)

          await AssetFromAnotherCompanyUnit.delete()
          await unitFromAnotherCompany.delete()
          await anotherCompany.delete()
        })
      })
      describe('When he wants to delete an asset from its own company', () => {
        describe('When the Asset does not exist', () => {
          it('should return an Asset Not Find error', async () => {
            const response = await request(expressApp).delete('/asset/123')
              .set('Authorization', `Bearer ${normalUserToken}`)

            expect(response.statusCode).toBe(404)
            expect(response.body.error).toBe(new AssetNotFoundError().message)
          })
        })
        describe('When the asset exist', () => {
          it('should delete the Asset', async () => {
            const unit = await FactoryUnit.create({ companyId: company.id })
            const asset = await FactoryAsset.create({ unitId: unit.id })
            const response = await request(expressApp).delete(`/asset/${asset.id}`)
              .set('Authorization', `Bearer ${normalUserToken}`)

            expect(response.statusCode).toBe(204)
            const findAsset = await prisma.asset.findUnique({ where: { id: asset.id } })
            expect(findAsset).toBeNull()
          })
        })
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).delete('/asset/123')

      expect(response.statusCode).toBe(401)
    })
  })
})
