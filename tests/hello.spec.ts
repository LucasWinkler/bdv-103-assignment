import { describe, expect, it } from 'vitest'

import { setup } from '../database_test_setup'
import { type TestContext } from './startServer'
import { Configuration, DefaultApi } from '../client'

await setup()

describe('Hello API', () => {
  it<TestContext>('should return greeting with provided name', async (context) => {
    const client = new DefaultApi(new Configuration({ basePath: context.address }))

    const name = 'World'
    const response = await client.getHello({ name })

    expect(response.message).toEqual(`Hello ${name}`)
  })
})
