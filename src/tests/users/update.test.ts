import { faker } from '@faker-js/faker'
import expressApp from '../../main/express/setup-express'

import { UserRoles } from '@prisma/client'
import request from 'supertest'
import { AccessDeniedError, EmailAlreadyInUse, UserNotFoundError } from '../../domain/errors'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('Update User Tests', () => {
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

    describe('When he is a SuperAdmin', () => {
      describe('And he wants to change an users role', () => {
        it('should update the user', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id, role: UserRoles.Admin })
          const response = await request(expressApp).patch(`/user/${anotherUser.id}`)
            .send({
              role: UserRoles.SuperAdmin
            }).set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(anotherUser.id)
          expect(response.body.role).toBe(UserRoles.SuperAdmin)

          await anotherUser.delete()
          await anotherCompany.delete()
        })
      })
      describe('And he wants to update ab user password besides himself', () => {
        it('should return an forbidden error', async () => {
          const response = await request(expressApp).patch(`/user/${adminUser.id}`)
            .send({
              password: faker.internet.password()
            }).set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(403)
          expect(response.body.error).toBe(new AccessDeniedError().message)
        })
      })
      describe('And he wants to update an user from another company', () => {
        it('should update the user', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id, role: UserRoles.SuperAdmin })
          const newName = faker.person.fullName()
          const response = await request(expressApp).patch(`/user/${anotherUser.id}`)
            .send({
              name: newName
            }).set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(anotherUser.id)
          expect(response.body.name).toBe(newName)

          await anotherUser.delete()
          await anotherCompany.delete()
        })
      })
      describe('And the email is already in use', () => {
        describe('by the same user', () => {
          it('should update the user', async () => {
            const newName = faker.person.fullName()
            const response = await request(expressApp).patch(`/user/${adminUser.id}`)
              .send({
                name: newName,
                email: adminUser.email
              })
              .set('Authorization', `Bearer ${adminUser.token}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.id).toBe(adminUser.id)
            expect(response.body.name).toBe(newName)
            expect(response.body.email).toBe(adminUser.email)
          })
        })
        describe('by another user', () => {
          it('should throw a email already in use error', async () => {
            const response = await request(expressApp).patch(`/user/${adminUser.id}`)
              .send({
                email: normalUser.email
              })
              .set('Authorization', `Bearer ${adminUser.token}`)

            expect(response.statusCode).toBe(400)
            expect(response.body.error).toBe(new EmailAlreadyInUse().message)
          })
        })
      })
    })
    describe('When he is an Admin', () => {
      describe('And he wants to update an user of its own company', () => {
        describe('And it is an Admin user', () => {
          describe('And he wants to update its role to SuperAdmin', () => {
            it('should return a Access Denied error', async () => {
              const anotherAdmin = await FactoryUser.create({ companyId: company.id, role: UserRoles.Admin })
              const response = await request(expressApp).patch(`/user/${anotherAdmin.id}`)
                .send({
                  role: UserRoles.SuperAdmin
                })
                .set('Authorization', `Bearer ${adminUser.token}`)

              expect(response.statusCode).toBe(403)
              expect(response.body.error).toBe(new AccessDeniedError().message)

              await anotherAdmin.delete()
            })
          })
          describe('And he wants to update its password', () => {
            it('should return a Access Denied error', async () => {
              const response = await request(expressApp).patch(`/user/${normalUser.id}`)
                .send({
                  name: faker.person.fullName(),
                  password: faker.internet.password()
                })
                .set('Authorization', `Bearer ${adminUser.token}`)

              expect(response.statusCode).toBe(403)
              expect(response.body.error).toBe(new AccessDeniedError().message)
            })
          })
          it('should update the user', async () => {
            const anotherAdmin = await FactoryUser.create({ companyId: company.id, role: UserRoles.Admin })
            const newName = faker.person.fullName()
            const response = await request(expressApp).patch(`/user/${anotherAdmin.id}`)
              .send({
                name: newName
              })
              .set('Authorization', `Bearer ${adminUser.token}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.id).toBe(anotherAdmin.id)
            expect(response.body.name).toBe(newName)
          })
        })
        describe('And it is a SuperAdmin user', () => {
          it('should return a Access Denied error', async () => {
            const response = await request(expressApp).patch(`/user/${superAdminUser.id}`)
              .send({
                name: faker.person.fullName()
              })
              .set('Authorization', `Bearer ${adminUser.token}`)

            expect(response.statusCode).toBe(403)
            expect(response.body.error).toBe(new AccessDeniedError().message)
          })
        })
        describe('And it is himself', () => {
          describe('And he wants to update its own role', () => {
            it('should return a Access Denied error', async () => {
              const response = await request(expressApp).patch(`/user/${adminUser.id}`)
                .send({
                  role: UserRoles.SuperAdmin
                })
                .set('Authorization', `Bearer ${adminUser.token}`)

              expect(response.statusCode).toBe(403)
              expect(response.body.error).toBe(new AccessDeniedError().message)
            })
          })
          it('should update the user', async () => {
            const newName = faker.person.fullName()
            const newPassword = faker.internet.password()
            const response = await request(expressApp).patch(`/user/${adminUser.id}`)
              .send({
                name: newName,
                password: newPassword
              })
              .set('Authorization', `Bearer ${adminUser.token}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.id).toBe(adminUser.id)
            expect(response.body.name).toBe(newName)

            const loginResponse = await request(expressApp).post('/login')
              .send({
                email: adminUser.email,
                password: newPassword
              })
            expect(loginResponse.statusCode).toBe(200)
            expect(loginResponse.body.accessToken).toBeTruthy()
          })
        })
      })
      describe('And he wants to update an user from another company', () => {
        it('should return ab User Not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).patch(`/user/${anotherUser.id}`)
            .send({
              name: faker.person.fullName()
            }).set('Authorization', `Bearer ${adminUser.token}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new UserNotFoundError().message)

          await anotherUser.delete()
          await anotherCompany.delete()
        })
      })
    })
    describe('When he is a Normal User', () => {
      describe('And he wants to update another user', () => {
        it('should return a Access Denied error', async () => {
          const response = await request(expressApp).patch(`/user/${adminUser.id}`)
            .set('Authorization', `Bearer ${normalUser.token}`)

          expect(response.statusCode).toBe(403)
          expect(response.body.error).toBe(new AccessDeniedError().message)
        })
      })
      describe('And he wants to update his own information', () => {
        describe('And he wants to update its own role', () => {
          it('should return a Access Denied error', async () => {
            const response = await request(expressApp).patch(`/user/${normalUser.id}`)
              .send({
                role: UserRoles.Admin
              })
              .set('Authorization', `Bearer ${normalUser.token}`)

            expect(response.statusCode).toBe(403)
            expect(response.body.error).toBe(new AccessDeniedError().message)
          })
        })
        it('should update the user', async () => {
          const newName = faker.person.fullName()
          const newPassword = faker.internet.password()
          const response = await request(expressApp).patch(`/user/${normalUser.id}`)
            .send({
              name: newName,
              password: newPassword
            })
            .set('Authorization', `Bearer ${normalUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.id).toBe(normalUser.id)
          expect(response.body.name).toBe(newName)

          const loginResponse = await request(expressApp).post('/login')
            .send({
              email: normalUser.email,
              password: newPassword
            })
          expect(loginResponse.statusCode).toBe(200)
          expect(loginResponse.body.accessToken).toBeTruthy()
        })
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).patch('/user/123')

      expect(response.statusCode).toBe(401)
    })
  })
})
