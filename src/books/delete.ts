import { ObjectId } from 'mongodb'
import { type BookDatabaseAccessor } from '../database_access'
import { type BookID } from '../../adapter/assignment-4'

export async function deleteBook (books: BookDatabaseAccessor, id: BookID): Promise<boolean> {
  const { books: bookCollection } = books
  const objectId = ObjectId.createFromHexString(id)
  const result = await bookCollection.deleteOne({ _id: { $eq: objectId } })
  return result.deletedCount === 1
}
