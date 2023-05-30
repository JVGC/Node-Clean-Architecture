export class UnauthorizedError extends Error {
    constructor () {
      super('Unauthorized')
      this.name = 'UnauthorizedError'
    }
}

export class ServerError extends Error {
    constructor (message: string) {
      super('Internal server error')
      this.name = 'ServerError'
      this.message = message
    }
}