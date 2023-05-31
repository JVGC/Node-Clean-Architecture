import { NextFunction, Request, Response } from 'express'
import { AuthMiddleware } from '../../presentation/middlewares/auth-middleware'
import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest } from '../../presentation/protocols/http'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: (req.body || {}),
      params: (req.params || {}),
      query: (req.query || {})
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}

export const adaptAuthMiddleware = (authMiddleware: AuthMiddleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse= await authMiddleware.handle(httpRequest)
    if(httpResponse.statusCode === 200){
      Object.assign(req, httpResponse.body)
      next()
    }else{
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
