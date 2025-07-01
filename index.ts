import Koa from 'koa'
import cors from '@koa/cors'
import zodRouter from 'koa-zod-router'
import qs from 'koa-qs'
import { setupBookRoutes } from './src/books'
import { setupWarehouseRoutes } from './src/warehouse'
import KoaRouter from '@koa/router'
import { koaSwagger } from 'koa2-swagger-ui'
import swagger from './build/swagger.json'
import { RegisterRoutes } from './build/routes'

const app = new Koa()
const koaRouter = new KoaRouter()

qs(app)

app.use(cors())

const router = zodRouter({ zodRouter: { exposeRequestErrors: true } })

setupBookRoutes(router)
setupWarehouseRoutes(router)

app.use(router.routes())

RegisterRoutes(koaRouter)

app.use(koaRouter.routes())
app.use(koaSwagger({
  routePrefix: '/docs',
  specPrefix: '/docs/spec',
  exposeSpec: true,
  swaggerOptions: {
    spec: swagger
  }
}))

app.listen(3000, () => {
  console.log('listening!')
})
