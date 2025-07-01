import { describe, expect, it } from 'vitest'

import { type TestContext } from './startServer'
import { Configuration, DefaultApi } from '../client'
import startServer from './startServer'

startServer()

describe('Hello API', () => {
  it<TestContext>('should return greeting with provided name', async (context) => {
    const client = new DefaultApi(new Configuration({ basePath: context.address }))

    const name = 'World'
    const response = await client.getHello({ name })

    expect(response.message).toEqual(`Hello ${name}`)
  })
})
