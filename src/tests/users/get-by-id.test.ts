import { UserRoles } from '@prisma/client'
import expressApp from '../../main/express/setup-express'

import request from 'supertest'
import { UserNotFoundError } from '../../domain/errors'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('Get User By Id Tests', () => {
  describe('Given an Authenticated User', () => {
    let normalUser: FactoryUser,
      adminUser: FactoryUser,
      superAdminUser: FactoryUser,
      company: FactoryCompany

    beforeAll(async () => {
      company = await FactoryCompany.create({})

      const users = await Promise.all([
        FactoryUser.create({ companyId: company.id, role: UserRoles.User }),
        FactoryUser.create({ companyId: company.id, role: UserRoles.Admin }),
        FactoryUser.create({ companyId: company.id, role: UserRoles.SuperAdmin })
      ])
      normalUser = users[0]
      adminUser = users[1]
      superAdminUser = users[2]

      await Promise.all([
        normalUser.login(),
        adminUser.login(),
        superAdminUser.login()
      ])
    })
    afterAll(async () => {
      await Promise.all([normalUser.delete(), adminUser.delete(), superAdminUser.delete()])
      await company.delete()
    })

    describe('When he is a SuperAdmin',() => {
      describe('And he wants to get an user from another company', () => {
        it('should return the user', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).get(`/user/${anotherUser.id}`)
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(anotherUser.id)
          expect(response.body.email).toBe(anotherUser.email)
          expect(response.body.role).toBe(anotherUser.role)
          expect(response.body.companyId).toBe(anotherUser.companyId)
          expect(response.body.password).toBeFalsy()

          await anotherUser.delete()
          await anotherCompany.delete()
        })
      })
    })
    describe('When he is a Admin', () => {
      describe('And he wants to get an user from another company', () => {
        it('should return an User Not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).get(`/user/${anotherUser.id}`)
            .set('Authorization', `Bearer ${adminUser.token}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new UserNotFoundError().message)

          await anotherUser.delete()
          await anotherCompany.delete()
        })
      })
    })
    describe('When he is a Normal User', () => {
      describe('And it is himself', () => {
        it('should return the user', async () => {
          const response = await request(expressApp).get(`/user/${normalUser.id}`)
            .set('Authorization', `Bearer ${normalUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(normalUser.id)
          expect(response.body.email).toBe(normalUser.email)
          expect(response.body.role).toBe(normalUser.role)
          expect(response.body.companyId).toBe(normalUser.companyId)
          expect(response.body.password).toBeFalsy()
        })
      })
      describe('And it is ab user from the same company', () => {
        it('should return the user', async () => {
          const anotherUser = await FactoryUser.create({ companyId: company.id })
          const response = await request(expressApp).get(`/user/${anotherUser.id}`)
            .set('Authorization', `Bearer ${normalUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(anotherUser.id)
          expect(response.body.email).toBe(anotherUser.email)
          expect(response.body.role).toBe(anotherUser.role)
          expect(response.body.companyId).toBe(anotherUser.companyId)
          expect(response.body.password).toBeFalsy()

          await anotherUser.delete()
        })
      })
      describe('And it is an user from another company', () => {
        it('should return an User Not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).get(`/user/${anotherUser.id}`)
            .set('Authorization', `Bearer ${normalUser.token}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new UserNotFoundError().message)

          await anotherUser.delete()
          await anotherCompany.delete()
        })
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).get('/user/123')

      expect(response.statusCode).toBe(401)
    })
  })
})
