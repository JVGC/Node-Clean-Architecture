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

export class UserNotFoundError extends Error {
  constructor () {
    super('User not found')
    this.name = 'UserNotFoundError'
  }
}

export class EmailAlreadyInUse extends Error {
  constructor () {
    super('Email is already in use')
    this.name = 'EmailAlreadyInUse'
  }
}

export class UnitNotFoundError extends Error {
  constructor () {
    super('Unit not found')
    this.name = 'UnitNotFoundError'
  }
}

export class AssetNotFoundError extends Error {
  constructor () {
    super('Asset not found')
    this.name = 'AssetNotFoundError'
  }
}


export class AccessDeniedError extends Error {
  constructor () {
    super('Access denied')
    this.name = 'AccessDeniedError'
  }
}