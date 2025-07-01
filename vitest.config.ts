import { defineConfig } from 'vitest/config'
import vitestOpenapiPlugin from './vitest-openapi-plugin'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'],
    setupFiles: ['./database_test_setup.ts']
  },
  plugins: [vitestOpenapiPlugin],
  server: {
    watch: {
      ignored: ['build/**', 'client/**']
    }
  }
})
