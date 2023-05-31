import { Express, Router } from 'express'
import { adaptRoute } from '../adapters/express-adapter'
import { makeCreateCompany, makeDeleteCompanyById, makeGetCompanyById, makeListCompanies } from '../factories/company-controllers-factory'

export default (app: Express): void => {

    const router = Router()
    app.use('/', router)
    app.use('/', router)
    router.post('/company', adaptRoute(makeCreateCompany()))
    router.get('/company/:id', adaptRoute(makeGetCompanyById()))
    router.delete('/company/:id', adaptRoute(makeDeleteCompanyById()))
    router.get('/company', adaptRoute(makeListCompanies()))
  }