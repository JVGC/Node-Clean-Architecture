import express from 'express'
import { bodyParser, contentType, cors } from "./middlewares/basic-middlewares"
import setupRoutes from './routes'

const expressApp = express()
expressApp.use(bodyParser)
expressApp.use(cors)
expressApp.use(contentType)
setupRoutes(expressApp)

export default expressApp