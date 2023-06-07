import { CreateUserUseCase } from '../../domain/usecases/users/create-user'
import { DeleteUserByIdUseCase } from '../../domain/usecases/users/delete-user'
import { GetUserByIdUseCase } from '../../domain/usecases/users/get-user-by-id'
import { ListUsersUseCase } from '../../domain/usecases/users/list-users'
import { UpdateUserUseCase } from '../../domain/usecases/users/update-user'
import { BcryptAdapter } from '../../infra/criptography/bcrypt'
import { PrismaCompanyRepository } from '../../infra/prisma/repositories/prisma-company-repository'
import { PrismaUserRepository } from '../../infra/prisma/repositories/prisma-user-repository'
import { CreateUserController } from '../../presentation/controllers/users/create-user-controller'
import { DeleteUserByIdController } from '../../presentation/controllers/users/delete-user-by-id-controller'
import { GetUserByIdController } from '../../presentation/controllers/users/get-user-by-id-controller'
import { ListUsersController } from '../../presentation/controllers/users/list-users-controller'
import { UpdateUserController } from '../../presentation/controllers/users/update-user-controller'
import { ZodValidator } from '../../presentation/helpers/zod-validator'
import { zodCreateUserObject, zodUpdateUserObject } from '../../presentation/helpers/zod-validators/users'

export const makeCreateUser = (): CreateUserController => {
  const salt = 12
  const bcryptHasher = new BcryptAdapter(salt)
  const prismaUserRepository = new PrismaUserRepository()
  const prismacompanyRepository = new PrismaCompanyRepository()
  const createUserUseCase = new CreateUserUseCase(prismaUserRepository, prismacompanyRepository, bcryptHasher)
  const zodCreateUserValidator = new ZodValidator(zodCreateUserObject)
  return new CreateUserController(createUserUseCase, zodCreateUserValidator)
}

export const makeGetUserById = (): GetUserByIdController => {
  const prismaUserRepository = new PrismaUserRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(prismaUserRepository)
  return new GetUserByIdController(getUserByIdUseCase)
}

export const makeListUsers = (): ListUsersController => {
  const prismaUserRepository = new PrismaUserRepository()
  const listUsersUseCase = new ListUsersUseCase(prismaUserRepository)
  return new ListUsersController(listUsersUseCase)
}

export const makeDeleteUserById = (): DeleteUserByIdController => {
  const prismaUserRepository = new PrismaUserRepository()
  const deleteUserByIdUseCase = new DeleteUserByIdUseCase(prismaUserRepository)
  return new DeleteUserByIdController(deleteUserByIdUseCase)
}

export const makeUpdateUser = (): UpdateUserController => {
  const salt = 12
  const bcryptHasher = new BcryptAdapter(salt)
  const prismaUserRepository = new PrismaUserRepository()
  const updateUserUseCase = new UpdateUserUseCase(prismaUserRepository, bcryptHasher)
  const zodUpdateUserValidator = new ZodValidator(zodUpdateUserObject)
  return new UpdateUserController(updateUserUseCase, zodUpdateUserValidator)
}
