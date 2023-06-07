
import expressApp from '../../main/express/setup-express'

import { faker } from '@faker-js/faker'
import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { UnitNotFoundError } from '../../domain/errors'
import { FactoryCompany } from '../factories/company'
import { FactoryUnit } from '../factories/unit'
import { FactoryUser } from '../factories/user'

describe('Update Unit Tests', () => {
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
      describe('And he wants to update an Unit of Another Company', () => {
        it('should update the Unit', async () => {
          const newName = faker.commerce.productName()
          const newDescription = faker.commerce.productDescription()
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).patch(`/unit/${unitFromAnotherCompany.id}`)
            .send({
              name: newName,
              description: newDescription
            })
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(unitFromAnotherCompany.id)
          expect(response.body.name).toBe(newName)
          expect(response.body.description).toBe(newDescription)

          await unitFromAnotherCompany.delete()
          await anotherCompany.delete()
        })
      })
      describe('And he sends invalid params', () => {
        it('should return an bad request error', async () => {
          const response = await request(expressApp).patch('/unit/123')
            .send({
              name: [],
              description: false
            })
            .set('Authorization', `Bearer ${superAdminUser.token}`)
          expect(response.statusCode).toBe(400)
        })
      })
    })
    describe('When he is not a SuperAdmin', () => {
      describe('And he wants to update an unit from another company', () => {
        it('Should return an Unit not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const unitFromAnotherCompany = await FactoryUnit.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).patch(`/unit/${unitFromAnotherCompany.id}`)
            .send({
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription()
            })
            .set('Authorization', `Bearer ${normalUser.token}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new UnitNotFoundError().message)

          await unitFromAnotherCompany.delete()
          await anotherCompany.delete()
        })
      })
      describe('When he wants to update an unit from its own company', () => {
        describe('When the unit does not exist', () => {
          it('should return an Unit Not Find error', async () => {
            const response = await request(expressApp).patch('/unit/123')
              .send({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription()
              })
              .set('Authorization', `Bearer ${normalUser.token}`)

            expect(response.statusCode).toBe(404)
            expect(response.body.error).toBe(new UnitNotFoundError().message)
          })
        })
        describe('When the unit exists', () => {
          it('should update the Unit', async () => {
            const newName = faker.commerce.productName()
            const newDescription = faker.commerce.productDescription()
            const unit = await FactoryUnit.create({ companyId: company.id })
            const response = await request(expressApp).patch(`/unit/${unit.id}`)
              .send({
                name: newName,
                description: newDescription
              })
              .set('Authorization', `Bearer ${normalUser.token}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.id).toBe(unit.id)
            expect(response.body.name).toBe(newName)
            expect(response.body.description).toBe(newDescription)

            await unit.delete()
          })
        })
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).patch('/unit/123')
        .send({
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription()
        })

      expect(response.statusCode).toBe(401)
    })
  })
})
