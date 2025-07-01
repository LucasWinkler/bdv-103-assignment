import { createServer } from './server'

const PORT = Number(process.env.PORT) ?? 3000

await createServer(PORT)
