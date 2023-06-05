import expressApp from './main/express/setup-express'

try {
  expressApp.listen(process.env.PORT, () => { console.log(`Server running at http://localhost:${process.env.PORT}`) })
} catch (error) {
  console.log(`Server not running error thrown: ${error}`)
}
