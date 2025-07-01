import { afterEach, beforeEach } from 'vitest'

import { createServer } from '../server'
import { type AppState } from '../src/state'

export interface TestContext {
  address: string
  state: AppState
  close: () => void
}

export async function setupTestServer (): Promise<void> {
  beforeEach<TestContext>(async (context) => {
    const { server, state } = await createServer()

    const address = server.address()
    const port = typeof address === 'object' && address !== null ? address.port : 0

    context.address = `http://localhost:${port}`
    context.close = () => {
      server.close()
    }
    context.state = state
  })

  afterEach<TestContext>((context) => {
    if (context.close !== undefined) {
      context.close()
    }
  })
}
