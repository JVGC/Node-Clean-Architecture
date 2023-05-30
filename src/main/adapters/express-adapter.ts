import { Request, Response } from 'express'
import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest } from '../../presentation/protocols/http'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    console.log(req)
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
