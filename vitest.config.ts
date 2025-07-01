import { defineConfig } from 'vitest/config'
import vitestOpenapiPlugin from './vitest-openapi-plugin'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'],
    setupFiles: ['./database_test_setup.ts'],
    globalSetup: './global_database_install.ts',
    testTimeout: 10000,
    hookTimeout: 15000,
    teardownTimeout: 10000
  },
  plugins: [vitestOpenapiPlugin],
  server: {
    watch: {
      ignored: ['build/**', 'client/**']
    }
  }
})
