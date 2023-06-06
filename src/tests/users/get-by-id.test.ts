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
      company: FactoryCompany,
      normalUserToken: string,
      adminToken: string,
      superAdminToken: string
    beforeAll(async () => {
      company = await FactoryCompany.create({})
      normalUser = await FactoryUser.create({ companyId: company.id, role: UserRoles.User })
      normalUserToken = await normalUser.login()
      superAdminUser = await FactoryUser.create({ companyId: company.id, role: UserRoles.SuperAdmin })
      superAdminToken = await superAdminUser.login()
      adminUser = await FactoryUser.create({ companyId: company.id, role: UserRoles.Admin })
      adminToken = await adminUser.login()
    })
    afterAll(async () => {
      await normalUser.delete()
      await adminUser.delete()
      await superAdminUser.delete()
      await company.delete()
    })
    describe('When he is a SuperAdmin',() => {
      describe('And it is an user from another company', () => {
        it('should return the user', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).get(`/user/${anotherUser.id}`)
            .set('Authorization', `Bearer ${superAdminToken}`)

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
      describe('And it is an user from another company', () => {
        it('should return an User Not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).get(`/user/${anotherUser.id}`)
            .set('Authorization', `Bearer ${adminToken}`)

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
            .set('Authorization', `Bearer ${normalUserToken}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(normalUser.id)
          expect(response.body.email).toBe(normalUser.email)
          expect(response.body.role).toBe(normalUser.role)
          expect(response.body.companyId).toBe(normalUser.companyId)
          expect(response.body.password).toBeFalsy()
        })
      })
      describe('And it is a user from the same company', () => {
        it('should return the user', async () => {
          const anotherUser = await FactoryUser.create({ companyId: company.id })
          const response = await request(expressApp).get(`/user/${anotherUser.id}`)
            .set('Authorization', `Bearer ${normalUserToken}`)

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
            .set('Authorization', `Bearer ${normalUserToken}`)

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
