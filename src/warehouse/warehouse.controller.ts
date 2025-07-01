import { Controller, Get, Path, Request, Route } from 'tsoa'
import { type ParameterizedContext, type DefaultContext, type Request as KoaRequest } from 'koa'
import { type BookID, type ShelfId } from '../../adapter/assignment-4'
import { AppWarehouseDatabaseState } from './warehouse_database'
import { getBookInfo } from './get_book_info'


@Route('warehouse')
export class WarehouseController extends Controller {
  @Get('{book}')
  public async getBookInfo(
    @Path() book: BookID,
    @Request() request: KoaRequest
  ): Promise<Record<ShelfId, number>> {
    const ctx: ParameterizedContext<AppWarehouseDatabaseState, DefaultContext> = request.ctx
    const warehouse = ctx.state.warehouse
    const response = await getBookInfo(warehouse, book)

    return response
  }
} 