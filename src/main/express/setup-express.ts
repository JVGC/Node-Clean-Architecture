import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { bodyParser, contentType, cors } from "./middlewares/basic-middlewares"
import setupRoutes from './routes'
import swaggerFile from './swagger.json'

const expressApp = express()
expressApp.get('/',function(req,res){
    res.sendFile('/usr/app/public/index.html');
});
expressApp.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
expressApp.use(bodyParser)
expressApp.use(cors)
expressApp.use(contentType)
setupRoutes(expressApp)


export default expressApp