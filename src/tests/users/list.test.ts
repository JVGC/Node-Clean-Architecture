import { UserRoles } from '@prisma/client'
import expressApp from '../../main/express/setup-express'

import request from 'supertest'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('List Users Tests', () => {
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
    describe('When he is a SuperAdmin',() => {
      it('should return all the users in the database', async () => {
        const anotherCompany = await FactoryCompany.create({})
        const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id })
        const response = await request(expressApp).get('/user')
          .set('Authorization', `Bearer ${superAdminToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(3)
        const usersId = response.body.map((user: { id: string }) => user.id)
        expect(usersId).toContain(anotherUser.id)

        await anotherUser.delete()
        await anotherCompany.delete()
      })
    })
    describe('When he is not a SuperAdmin', () => {
      it('should return only the information about the user from its own company', async () => {
        const anotherCompany = await FactoryCompany.create({})
        const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id })
        const response = await request(expressApp).get('/user')
          .set('Authorization', `Bearer ${normalUserToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(2)
        const usersId = response.body.map((user: { id: string }) => user.id)
        expect(usersId).not.toContain(anotherUser.id)

        await anotherUser.delete()
        await anotherCompany.delete()
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).get('/user')

      expect(response.statusCode).toBe(401)
    })
  })
})
