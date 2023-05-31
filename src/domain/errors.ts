export class CompanyNotFoundError extends Error {
    constructor () {
      super('Company not found')
      this.name = 'CompanyNotFoundError'
    }
}
export class CodeAlreadyInUse extends Error {
    constructor () {
      super('Code is already in use')
      this.name = 'CodeAlreadyInUse'
    }
}