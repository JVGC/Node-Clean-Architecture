import { removeUserPasswordAdapter } from '../../adapters/user-adapter'
import { CompanyNotFoundError, EmailAlreadyInUse } from '../../errors'
import { type UserModelResponse, type UserRoles } from '../../models/user'
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

  async create (data: CreateUserParams): Promise<UserModelResponse> {
    const company = await this.companyRepository.getById(data.companyId)
    if (!company) throw new CompanyNotFoundError()
    const isEmailInUse = await this.userRepository.getByEmail(data.email)
    if (isEmailInUse) throw new EmailAlreadyInUse()

    const hashedPassword = await this.hasher.hash(data.password)
    const user = await this.userRepository.create({ ...data, password: hashedPassword })
    return removeUserPasswordAdapter(user)
  }
}
