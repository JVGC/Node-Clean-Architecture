import expressApp from '../../main/express/setup-express'

import { faker } from '@faker-js/faker'
import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { UnitNotFoundError } from '../../domain/errors'
import { AssetsStatus } from '../../domain/models/asset'
import prisma from '../../infra/prisma/client'
import { FactoryCompany } from '../factories/company'
import { FactoryUnit } from '../factories/unit'
import { FactoryUser } from '../factories/user'

describe('Create Asset Tests', () => {
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
      describe('And he wants to create an Asset for Another Company', () => {
        it('should create the Asset', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const name = faker.commerce.product()
          const description = faker.commerce.productDescription()
          const response = await request(expressApp).post('/asset').send({
            name,
            description,
            model: faker.vehicle.model(),
            owner: faker.company.name(),
            status: AssetsStatus.Running,
            healthLevel: 100,
            imageURL: faker.image.url(),
            unitId: unitFromAnotherCompany.id
          }).set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(201)
          expect(response.body.id).toBeTruthy()
          expect(response.body.name).toBe(name)
          expect(response.body.description).toBe(description)
          expect(response.body.unitName).toBe(unitFromAnotherCompany.name)

          await prisma.asset.delete({ where: { id: response.body.id } })
          await anotherCompany.delete()
        })
      })
      describe('And he sent invalid params', () => {
        it('should return a bad request error', async () => {
          const unit = await FactoryUnit.create({ companyId: company.id })
          const response = await request(expressApp).post('/asset').send({
            name: false,
            description: [],
            status: 'testing',
            healthLevel: 1000,
            unitId: unit.id
          }).set('Authorization', `Bearer ${superAdminUser.token}`)
          expect(response.statusCode).toBe(400)

          await unit.delete()
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      describe('And he wants to create an asset for another company', () => {
        it('Should return an Unit not Found error', async () => {
          const response = await request(expressApp).post('/asset').send({
            name: faker.commerce.product(),
            description: faker.internet.password(),
            model: faker.vehicle.model(),
            owner: faker.company.name(),
            status: AssetsStatus.Running,
            healthLevel: 100,
            imageURL: faker.image.url(),
            unitId: faker.database.mongodbObjectId()
          }).set('Authorization', `Bearer ${normalUser.token}`)

          expect(response.statusCode).toBe(400)
          expect(response.body.error).toBe(new UnitNotFoundError().message)
        })
      })
      describe('When he wants to create an asset for his own company', () => {
        it('should create the Asset', async () => {
          const unit = await FactoryUnit.create({ companyId: company.id })
          const name = faker.commerce.product()
          const description = faker.commerce.productDescription()
          const response = await request(expressApp).post('/asset').send({
            name,
            description,
            model: faker.vehicle.model(),
            owner: faker.company.name(),
            status: AssetsStatus.Running,
            healthLevel: 100,
            imageURL: faker.image.url(),
            unitId: unit.id
          }).set('Authorization', `Bearer ${normalUser.token}`)

          expect(response.statusCode).toBe(201)
          expect(response.body.id).toBeTruthy()
          expect(response.body.name).toBe(name)
          expect(response.body.description).toBe(description)
          expect(response.body.unitName).toBe(unit.name)

          await prisma.asset.delete({ where: { id: response.body.id } })
          await unit.delete()
        })
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).post('/asset').send({
        name: faker.commerce.product(),
        description: faker.internet.password(),
        model: faker.vehicle.model(),
        owner: faker.company.name(),
        status: AssetsStatus.Running,
        healthLevel: 100,
        imageURL: faker.image.url(),
        unitId: faker.database.mongodbObjectId()
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
