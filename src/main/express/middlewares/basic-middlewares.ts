import { type NextFunction, type Request, type Response, json } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', '*')
  res.set('access-control-allow-headers', '*')
  res.set('access-control-allow-methods', '*')
  next()
}

export const contentType = (req: Request, res: Response, next: NextFunction): void => {
  res.type('json')
  next()
}

export const bodyParser = json()
