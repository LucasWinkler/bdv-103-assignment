import { type ZodRouter } from 'koa-zod-router'
import booksList from './list'
import createOrUpdateBook from './create_or_update'
import deleteBook from './delete'
import getBookRoute from './lookup'
import { type BookDatabaseAccessor } from '../database_access'

export function setupBookRoutes (router: ZodRouter, books: BookDatabaseAccessor): void {
  // Setup Book List Route
  booksList(router, books)

  // Setup Book Create Route
  createOrUpdateBook(router, books)

  // Setup Book Delete Route
  deleteBook(router, books)

  // Lookup Book
  getBookRoute(router, books)
}
