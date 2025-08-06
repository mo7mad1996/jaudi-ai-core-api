import { ICollection } from '@common/base/application/dto/collection.interface';
import { IGetAllOptions } from '@common/base/application/interface/get-all-options.interface';

import { Book } from '@book/domain/book.entity';

export const BOOK_REPOSITORY_KEY = 'book_repository';

export interface IBookRepository {
  getAll(options: IGetAllOptions<Book>): Promise<ICollection<Book>>;
  getOneByIdOrFail(id: number): Promise<Book>;
  getOneById(id: number): Promise<Book>;
  saveOne(book: Book): Promise<Book>;
  updateOneOrFail(
    id: number,
    updates: Partial<Omit<Book, 'id'>>,
  ): Promise<Book>;
  deleteOneOrFail(id: number): Promise<void>;
}
