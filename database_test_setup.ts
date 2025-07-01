import { MongoMemoryServer } from 'mongodb-memory-server'
import { afterAll, beforeAll } from 'vitest'

let instance: MongoMemoryServer | null = null

export async function setup (): Promise<void> {
  try {
    instance = await MongoMemoryServer.create({
      binary: {
        version: '7.0.7',
        downloadDir: '/tmp/mongodb-binaries'
      },
      instance: {
        dbName: 'test-db'
      }
    })

    while (instance.state === 'new') {
      await instance.start()
    }

    const uri = instance.getUri()
    ;(global as any).__MONGOINSTANCE = instance
    ;(global as any).MONGO_URI = uri.slice(0, uri.lastIndexOf('/'))
  } catch (error) {
    console.error('Failed to setup MongoDB Memory Server:', error)
    throw error
  }
}

export async function teardown (): Promise<void> {
  try {
    if (instance !== null) {
      await instance.stop({ doCleanup: true })
      instance = null
    }
  } catch (error) {
    console.error('Failed to teardown MongoDB Memory Server:', error)
  }
}

beforeAll(setup, 30000)
afterAll(teardown, 10000)
