import expressApp from './main/express/setup-express'

try {
    expressApp.listen(3000, () => console.log(`Server running at http://localhost:${3000}`))
  } catch (error) {
    console.log(`Server not running error thrown: ${error}`)
  }