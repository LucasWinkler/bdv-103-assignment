import { Controller, Get, Post, Delete, Path, Request, Route, Body } from 'tsoa'
import { type ParameterizedContext, type DefaultContext, type Request as KoaRequest } from 'koa'
import { type BookID, type Book } from '../../adapter/assignment-4'
import { type AppBookDatabaseState } from '../database_access'
import { listBooks, type Filter } from './list'
import { createOrUpdateBook } from './create_or_update'
import { deleteBook } from './delete'
import { getBook } from './lookup'

@Route('books')
export class BooksController extends Controller {
  @Get()
  public async listBooks (
    @Request() request: KoaRequest
  ): Promise<Book[]> {
    const ctx: ParameterizedContext<AppBookDatabaseState, DefaultContext> = request.ctx
    const books = ctx.state.books

    const filters = (request as any).query?.filters as Filter[] | undefined

    const result = await listBooks(books, filters)
    return result
  }

  @Get('{id}')
  public async getBook (
    @Path() id: BookID,
      @Request() request: KoaRequest
  ): Promise<Book> {
    const ctx: ParameterizedContext<AppBookDatabaseState, DefaultContext> = request.ctx
    const books = ctx.state.books
    const result = await getBook(id, books)
    if (result === false) {
      this.setStatus(404)
      throw new Error('Book not found')
    }
    return result
  }

  @Post()
  public async createOrUpdateBook (
    @Body() book: Book,
      @Request() request: KoaRequest
  ): Promise<{ id: BookID }> {
    const ctx: ParameterizedContext<AppBookDatabaseState, DefaultContext> = request.ctx
    const books = ctx.state.books
    const result = await createOrUpdateBook(books, book)
    return result
  }

  @Delete('{id}')
  public async deleteBook (
    @Path() id: BookID,
      @Request() request: KoaRequest
  ): Promise<void> {
    const ctx: ParameterizedContext<AppBookDatabaseState, DefaultContext> = request.ctx
    const books = ctx.state.books
    const result = await deleteBook(books, id)
    if (!result) {
      this.setStatus(404)
      throw new Error('Book not found')
    }
  }
}
