import { removeUserPasswordAdapter } from '../../adapters/user-adapter'
import { AccessDeniedError, CompanyNotFoundError, EmailAlreadyInUse } from '../../errors'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../models/user'
import { type Hasher } from '../../protocols/criptography'
import { type CompanyRepository } from '../../protocols/repositories/company-repository'
import { type UserRepository } from '../../protocols/repositories/user-repository'

export interface CreateUserParams {
  name: string
  email: string
  password: string
  companyId: string
  role: UserRoles
}

export class CreateUserUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly hasher: Hasher
  ) {}

  async create (data: CreateUserParams, loggedUser: UserModelResponseWithoutPassword): Promise<UserModelResponseWithoutPassword> {
    if (loggedUser.role === UserRoles.Admin) {
      if (data.role === UserRoles.SuperAdmin) throw new AccessDeniedError()
      if (loggedUser.companyId !== data.companyId) { throw new CompanyNotFoundError() }
    }

    const company = await this.companyRepository.getById(data.companyId)
    if (!company) throw new CompanyNotFoundError()
    const isEmailInUse = await this.userRepository.getByEmail(data.email)
    if (isEmailInUse) throw new EmailAlreadyInUse()

    const hashedPassword = await this.hasher.hash(data.password)
    const user = await this.userRepository.create({ ...data, password: hashedPassword })
    return removeUserPasswordAdapter(user)
  }
}
