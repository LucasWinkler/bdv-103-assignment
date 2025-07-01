import previous_assignment from './assignment-3'
import { DefaultApi, Configuration } from '../client'
import { BASE_URL } from '../src/constants'

export type BookID = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
};

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
};

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks (filters?: Filter[]): Promise<Book[]> {
  return await previous_assignment.listBooks(filters)
}

async function createOrUpdateBook (book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook (book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

async function lookupBookById (book: BookID): Promise<Book> {
  const result = await fetch(`http://localhost:3000/books/${book}`)
  if (result.ok) {
    return await result.json() as Book
  } else {
    throw new Error('Couldnt Find Book')
  }
}

export type ShelfId = string
export type OrderId = string

async function placeBooksOnShelf (bookId: BookID, numberOfBooks: number, shelf: ShelfId): Promise<void> {
  const client = new DefaultApi(new Configuration({ basePath: BASE_URL }))
  await client.placeBooksOnShelf({ book: bookId, shelf, number: numberOfBooks })
}

async function orderBooks (order: BookID[]): Promise<{ orderId: OrderId }> {
  const client = new DefaultApi(new Configuration({ basePath: BASE_URL }))
  const orderId = await client.placeOrder({ placeOrderRequest: { order } })
  return { orderId }
}

async function findBookOnShelf (book: BookID): Promise<Array<{ shelf: ShelfId, count: number }>> {
  const client = new DefaultApi(new Configuration({ basePath: BASE_URL }))
  const results = await client.getBookInfo({ book }) as Record<ShelfId, number>
  const shelfArray: Array<{ shelf: ShelfId, count: number }> = []
  for (const shelf of Object.keys(results)) {
    shelfArray.push({
      shelf,
      count: results[shelf]
    })
  }
  return shelfArray
}

async function fulfilOrder (order: OrderId, booksFulfilled: Array<{ book: BookID, shelf: ShelfId, numberOfBooks: number }>): Promise<void> {
  const client = new DefaultApi(new Configuration({ basePath: BASE_URL }))
  await client.fulfilOrder({
    order,
    fulfilOrderRequestInner: booksFulfilled
  })
}

async function listOrders (): Promise<Array<{ orderId: OrderId, books: Record<BookID, number> }>> {
  const client = new DefaultApi(new Configuration({ basePath: BASE_URL }))
  const orders = await client.listOrders()
  return orders.map(order => ({
    orderId: order.orderId,
    books: order.books
  }))
}

const assignment = 'assignment-4'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
  placeBooksOnShelf,
  orderBooks,
  findBookOnShelf,
  fulfilOrder,
  listOrders,
  lookupBookById
}
