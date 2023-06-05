import { type Express, Router } from 'express'
import { adaptRoute } from '../adapters/express-adapter'
import { makeCreateAsset, makeDeleteAssetById, makeGetAssetById, makeListAssets, makeUpdateAsset } from '../factories/asset-controllers-factory'
import { makeLogin } from '../factories/auth-controllers-factory'
import { makeCreateCompany, makeDeleteCompanyById, makeGetCompanyById, makeListCompanies, makeUpdateCompany } from '../factories/company-controllers-factory'
import { makeCreateUnit, makeDeleteUnitById, makeGetUnitById, makeListUnits, makeUpdateUnit } from '../factories/unit-controllers-factory'
import { makeCreateUser, makeDeleteUserById, makeGetUserById, makeListUsers, makeUpdateUser } from '../factories/user-controllers-factory'
import { authMiddleware } from './middlewares/auth-middlewares'
import { adminMiddleware, superAdminMiddleware } from './middlewares/permissions-middleware'

export default (app: Express): void => {
  const router = Router()
  app.use('/', router)

  router.post('/login', adaptRoute(makeLogin()))

  router.post('/company', authMiddleware, superAdminMiddleware, adaptRoute(makeCreateCompany()))
  router.delete('/company/:id', authMiddleware, superAdminMiddleware, adaptRoute(makeDeleteCompanyById()))
  router.get('/company', authMiddleware, superAdminMiddleware, adaptRoute(makeListCompanies()))
  router.patch('/company/:id', authMiddleware, superAdminMiddleware, adaptRoute(makeUpdateCompany()))

  router.get('/company/:id', authMiddleware, adminMiddleware, adaptRoute(makeGetCompanyById()))
  router.post('/user', authMiddleware, adminMiddleware, adaptRoute(makeCreateUser()))
  router.get('/user/:id', authMiddleware, adminMiddleware, adaptRoute(makeGetUserById()))
  router.delete('/user/:id', authMiddleware, adminMiddleware, adaptRoute(makeDeleteUserById()))
  router.get('/user', authMiddleware, adminMiddleware, adaptRoute(makeListUsers()))

  router.patch('/user/:id', authMiddleware, adaptRoute(makeUpdateUser()))
  router.post('/unit', authMiddleware, adaptRoute(makeCreateUnit()))
  router.get('/unit/:id', authMiddleware, adaptRoute(makeGetUnitById()))
  router.delete('/unit/:id', authMiddleware, adaptRoute(makeDeleteUnitById()))
  router.get('/unit', authMiddleware, adaptRoute(makeListUnits()))
  router.patch('/unit/:id', authMiddleware, adaptRoute(makeUpdateUnit()))

  router.post('/asset', authMiddleware, adaptRoute(makeCreateAsset()))
  router.get('/asset/:id', authMiddleware, adaptRoute(makeGetAssetById()))
  router.delete('/asset/:id', authMiddleware, adaptRoute(makeDeleteAssetById()))
  router.get('/asset', authMiddleware, adaptRoute(makeListAssets()))
  router.patch('/asset/:id', authMiddleware, adaptRoute(makeUpdateAsset()))
}
