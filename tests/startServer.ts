import { afterEach, beforeEach } from 'vitest'

import { createServer } from '../server'

export interface TestContext {
  address: string
  close: () => void
}

export async function setupTestServer (): Promise<void> {
  beforeEach<TestContext>(async (context) => {
    const { server } = await createServer()

    const address = server.address()
    const port = typeof address === 'object' && address !== null ? address.port : 0

    context.address = `http://localhost:${port}`
    context.close = () => server.close()
  })

  afterEach<TestContext>((context) => {
    context.close()
  })
}
