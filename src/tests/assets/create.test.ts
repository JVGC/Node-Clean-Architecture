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
      describe('And he wants to create a Asset for Another Company', () => {
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
          }).set('Authorization', `Bearer ${superAdminToken}`)

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
        it.skip('should return a bad request error', async () => {
          const response = await request(expressApp).post('/asset').send({
            name: false,
            description: [],
            status: 'testing',
            healthLevel: 1000,
            companyId: company.id
          }).set('Authorization', `Bearer ${superAdminToken}`)

          expect(response.statusCode).toBe(400)
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      describe('And he wants to create a asset for another company', () => {
        it('Should return a Unit not Found error', async () => {
          const response = await request(expressApp).post('/asset').send({
            name: faker.commerce.product(),
            description: faker.internet.password(),
            model: faker.vehicle.model(),
            owner: faker.company.name(),
            status: AssetsStatus.Running,
            healthLevel: 100,
            imageURL: faker.image.url(),
            unitId: faker.database.mongodbObjectId()
          }).set('Authorization', `Bearer ${normalUserToken}`)

          expect(response.statusCode).toBe(400)
          expect(response.body.error).toBe(new UnitNotFoundError().message)
        })
      })
      describe('When he wants to create a unit for his own company', () => {
        it('should create the Unit', async () => {
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
          }).set('Authorization', `Bearer ${normalUserToken}`)

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
