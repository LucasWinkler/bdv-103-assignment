import { type BookDatabaseAccessor } from '../database_access'
import { type Book, type BookID } from '../../adapter/assignment-4'
import { ObjectId } from 'mongodb'

export async function createOrUpdateBook (books: BookDatabaseAccessor, book: Book): Promise<{ id: BookID }> {
  const { books: bookCollection } = books

  if (typeof book.id === 'string') {
    const id = book.id
    try {
      const result = await bookCollection.replaceOne({ _id: { $eq: ObjectId.createFromHexString(id) } }, {
        id,
        name: book.name,
        description: book.description,
        price: book.price,
        author: book.author,
        image: book.image
      })
      if (result.modifiedCount === 1) {
        return { id }
      } else {
        throw new Error('Book not found')
      }
    } catch (e) {
      throw new Error('Failed to update book')
    }
  } else {
    try {
      const result = await bookCollection.insertOne({
        name: book.name,
        description: book.description,
        price: book.price,
        author: book.author,
        image: book.image
      })
      return { id: result.insertedId.toHexString() }
    } catch (e) {
      throw new Error('Failed to create book')
    }
  }
}
