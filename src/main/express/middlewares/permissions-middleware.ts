import { adaptPermissionMiddleware } from '../../adapters/express-adapter'
import { makeAdminMiddleware, makeSuperAdminMiddleware } from '../../factories/middlewares-factory'

export const superAdminMiddleware = adaptPermissionMiddleware(makeSuperAdminMiddleware())
export const adminMiddleware = adaptPermissionMiddleware(makeAdminMiddleware())
