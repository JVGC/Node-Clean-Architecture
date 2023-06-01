import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { bodyParser, contentType, cors } from "./middlewares/basic-middlewares"
import setupRoutes from './routes'
import swaggerFile from './swagger.json'

console.log(swaggerFile)
const expressApp = express()

expressApp.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
expressApp.use(bodyParser)
expressApp.use(cors)
expressApp.use(contentType)
setupRoutes(expressApp)


export default expressApp