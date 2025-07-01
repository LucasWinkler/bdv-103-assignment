import { Controller, Get, Path, Request, Route, Post, Put, Body } from 'tsoa'
import { type ParameterizedContext, type DefaultContext, type Request as KoaRequest } from 'koa'
import { type BookID, type ShelfId, type OrderId } from '../../adapter/assignment-4'
import { AppWarehouseDatabaseState } from './warehouse_database'
import { getBookInfo } from './get_book_info'
import { placeBooksOnShelf } from './place_on_shelf'
import { placeOrder } from './place_order'
import { listOrders } from './list_orders'
import { fulfilOrder } from './fulfil_order'

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

  @Put('{book}/{shelf}/{number}')
  public async placeBooksOnShelf(
    @Path() book: BookID,
    @Path() shelf: ShelfId,
    @Path() number: number,
    @Request() request: KoaRequest
  ): Promise<void> {
    const ctx: ParameterizedContext<AppWarehouseDatabaseState, DefaultContext> = request.ctx
    const warehouse = ctx.state.warehouse

    await placeBooksOnShelf(warehouse, book, number, shelf)
  }
}

@Route('order')
export class OrderController extends Controller {
  @Post()
  public async placeOrder(
    @Body() body: { order: BookID[] },
    @Request() request: KoaRequest
  ): Promise<OrderId> {
    const ctx: ParameterizedContext<AppWarehouseDatabaseState, DefaultContext> = request.ctx
    const warehouse = ctx.state.warehouse

    const result = await placeOrder(warehouse, body.order)
    return result
  }

  @Get()
  public async listOrders(
    @Request() request: KoaRequest
  ): Promise<Array<{ orderId: OrderId, books: Record<BookID, number> }>> {
    const ctx: ParameterizedContext<AppWarehouseDatabaseState, DefaultContext> = request.ctx
    const warehouse = ctx.state.warehouse

    const result = await listOrders(warehouse)
    return result
  }

  @Put('fulfil/{order}')
  public async fulfilOrder(
    @Path() order: OrderId,
    @Body() booksFulfilled: Array<{ book: BookID, shelf: ShelfId, numberOfBooks: number }>,
    @Request() request: KoaRequest
  ): Promise<void> {
    const ctx: ParameterizedContext<AppWarehouseDatabaseState, DefaultContext> = request.ctx
    const warehouse = ctx.state.warehouse
    
    await fulfilOrder(warehouse, order, booksFulfilled)
  }
} 