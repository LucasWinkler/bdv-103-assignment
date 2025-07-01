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
import bodyParser from 'koa-bodyparser'
import { getBookDatabase } from './src/database_access'
import { getDefaultWarehouseDatabase } from './src/warehouse/warehouse_database'
import { type AppState } from './src/state'
import { type Server } from 'http'

export async function createServer (port: number = 0, randomizeDbNames: boolean = false): Promise<{ server: Server, state: AppState }> {
  const state: AppState = {
    books: getBookDatabase(getDbName(randomizeDbNames, 'bdv-103-books')),
    warehouse: await getDefaultWarehouseDatabase(getDbName(randomizeDbNames, 'bdv-103-warehouse'))
  }

  const app = new Koa<AppState, Koa.DefaultContext>()
  const koaRouter = new KoaRouter()

  app.use(async (ctx, next): Promise<void> => {
    ctx.state = state
    await next()
  })

  qs(app)

  app.use(cors())
  app.use(bodyParser())

  const router = zodRouter({ zodRouter: { exposeRequestErrors: true } })

  setupBookRoutes(router, state.books)
  setupWarehouseRoutes(router, state.warehouse)

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

  const server = app.listen(port, () => {
    const address = server.address()
    const actualPort = typeof address === 'object' && address !== null ? address.port : port

    console.log(`listening on port ${actualPort}`)
  })

  return { server, state }
}

function getDbName (randomizeDbNames: boolean, defaultDbName: string): string | undefined {
  return randomizeDbNames ? undefined : defaultDbName
}
