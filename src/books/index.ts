import { type ZodRouter } from 'koa-zod-router'
import booksList from './list'
import { type BookDatabaseAccessor } from '../database_access'

export function setupBookRoutes (router: ZodRouter, books: BookDatabaseAccessor): void {
  booksList(router, books)
}
