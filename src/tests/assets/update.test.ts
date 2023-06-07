
import expressApp from '../../main/express/setup-express'

import { faker } from '@faker-js/faker'
import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { AssetNotFoundError } from '../../domain/errors'
import { AssetsStatus } from '../../domain/models/asset'
import { FactoryAsset } from '../factories/asset'
import { FactoryCompany } from '../factories/company'
import { FactoryUnit } from '../factories/unit'
import { FactoryUser } from '../factories/user'

describe('Update Asset Tests', () => {
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
      describe('And he wants to update an Asset of Another Company', () => {
        it('should update the Asset', async () => {
          const newName = faker.commerce.productName()
          const newDescription = faker.commerce.productDescription()
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const assetFromAnotherCompanyUnit = await FactoryAsset.create({ unitId: unitFromAnotherCompany.id })

          const response = await request(expressApp).patch(`/asset/${assetFromAnotherCompanyUnit.id}`)
            .send({
              name: newName,
              description: newDescription
            })
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(assetFromAnotherCompanyUnit.id)
          expect(response.body.name).toBe(newName)
          expect(response.body.description).toBe(newDescription)

          await assetFromAnotherCompanyUnit.delete()
          await unitFromAnotherCompany.delete()
          await anotherCompany.delete()
        })
      })
      describe('And he sends invalid params', () => {
        it.skip('should return an bad request error', async () => {
          const response = await request(expressApp).patch('/asset/123')
            .send({
              name: false,
              description: [],
              status: 'testing',
              healthLevel: 1000
            })
            .set('Authorization', `Bearer ${superAdminUser.token}`)
          expect(response.statusCode).toBe(400)
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      describe('And he wants to update an asset from another company', () => {
        it('Should return an Asset not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const assetFromAnotherCompanyUnit = await FactoryAsset.create({ unitId: unitFromAnotherCompany.id })

          const response = await request(expressApp).patch(`/asset/${assetFromAnotherCompanyUnit.id}`)
            .send({
              name: faker.commerce.product(),
              description: faker.internet.password(),
              model: faker.vehicle.model(),
              owner: faker.company.name(),
              status: AssetsStatus.Alerting,
              healthLevel: 50,
              imageURL: faker.image.url()
            })
            .set('Authorization', `Bearer ${normalUser.token}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new AssetNotFoundError().message)

          await assetFromAnotherCompanyUnit.delete()
          await unitFromAnotherCompany.delete()
          await anotherCompany.delete()
        })
      })
      describe('When he wants to update an asset from its own company', () => {
        describe('When the asset does not exist', () => {
          it('should return an Asset Not Find error', async () => {
            const response = await request(expressApp).patch('/asset/123')
              .send({
                name: faker.commerce.product(),
                description: faker.internet.password(),
                model: faker.vehicle.model(),
                owner: faker.company.name(),
                status: AssetsStatus.Alerting,
                healthLevel: 50,
                imageURL: faker.image.url()
              })
              .set('Authorization', `Bearer ${normalUser.token}`)

            expect(response.statusCode).toBe(404)
            expect(response.body.error).toBe(new AssetNotFoundError().message)
          })
        })
        describe('When the asset exists', () => {
          it('should get the Asset', async () => {
            const newName = faker.commerce.productName()
            const newDescription = faker.commerce.productDescription()
            const unit = await FactoryUnit.create({ companyId: company.id })
            const asset = await FactoryAsset.create({ unitId: unit.id })
            const response = await request(expressApp).patch(`/asset/${asset.id}`)
              .send({
                name: newName,
                description: newDescription
              })
              .set('Authorization', `Bearer ${normalUser.token}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.id).toBe(asset.id)
            expect(response.body.name).toBe(newName)
            expect(response.body.description).toBe(newDescription)

            await asset.delete()
            await unit.delete()
          })
        })
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).patch('/asset/123')
        .send({
          name: faker.commerce.product(),
          description: faker.internet.password(),
          model: faker.vehicle.model(),
          owner: faker.company.name(),
          status: AssetsStatus.Alerting,
          healthLevel: 50,
          imageURL: faker.image.url()
        })

      expect(response.statusCode).toBe(401)
    })
  })
})
