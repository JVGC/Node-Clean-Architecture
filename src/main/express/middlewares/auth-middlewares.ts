import { adaptAuthMiddleware } from '../../adapters/express-adapter'
import { makeAuthMiddleware } from '../../factories/middlewares-factory'

export const authMiddleware = adaptAuthMiddleware(makeAuthMiddleware())
