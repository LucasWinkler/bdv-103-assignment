import { describe, expect, it } from 'vitest'

import { setup } from '../database_test_setup'

await setup()

describe('Hello API', () => {
  it('should return greeting with provided name', async () => {
    const name = 'World'
    const response = await fetch(`http://localhost:3000/hello/${name}`)

    expect(response.status).toBe(200)
    expect(response.json()).toEqual({ message: `Hello ${name}` })
  })
})
