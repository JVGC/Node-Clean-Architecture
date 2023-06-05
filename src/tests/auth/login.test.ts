import expressApp from '../../main/express/setup-express'

import { faker } from '@faker-js/faker'
import request from 'supertest'
import { UserNotFoundError } from '../../domain/errors'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('Login Tests', () => {
  describe('Given a Login Request', () => {
    describe('When the user exists', () => {
      let user: FactoryUser
      let company: FactoryCompany
      beforeAll(async () => {
        company = await FactoryCompany.create({})
        user = await FactoryUser.create({ companyId: company.id })
      })
      afterAll(async () => {
        await user.delete()
        await company.delete()
      })
      describe('and send the correct email/password combination', () => {
        it('Should return an access token', async () => {
          const response = await request(expressApp).post('/login').send(
            {
              email: user.email,
              password: user.password
            }
          )

          expect(response.statusCode).toBe(200)
          expect(response.body.accessToken).toBeTruthy()
        })
      })
      describe('and send an invalid password', () => {
        it('Should return User Not Found Error', async () => {
          const response = await request(expressApp).post('/login').send(
            {
              email: user.email,
              password: '123'
            }
          )

          expect(response.statusCode).toBe(400)
          expect(response.body.error).toBe(new UserNotFoundError().message)
        })
      })
    })
    describe('When the user does not exists', () => {
      it('Should return an User Not Found error', async () => {
        const response = await request(expressApp).post('/login').send(
          {
            email: faker.internet.email({ provider: 'tractian.com' }),
            password: faker.internet.password()
          }
        )

        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe(new UserNotFoundError().message)
      })
    })
    describe('When email/password are not sent', () => {
      it.skip('Should return a bad request error', async () => {
        const response = await request(expressApp).post('/login').send(
          {
            password: faker.internet.password()
          }
        )

        expect(response.statusCode).toBe(400)
      })
    })
  })
})
