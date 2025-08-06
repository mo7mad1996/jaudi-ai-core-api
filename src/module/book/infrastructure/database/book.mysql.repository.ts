import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ICollection } from '@common/base/application/dto/collection.interface';
import { IGetAllOptions } from '@common/base/application/interface/get-all-options.interface';

import { IBookRepository } from '@book/application/repository/book.repository.interface';
import { Book } from '@book/domain/book.entity';
import { BookSchema } from '@book/infrastructure/database/book.schema';
import { BookNotFoundException } from '@book/infrastructure/database/exception/book-not-found.exception';

export class BookMysqlRepository implements IBookRepository {
  constructor(
    @InjectRepository(BookSchema)
    private readonly repository: Repository<Book>,
  ) {}

  async getAll(options?: IGetAllOptions<Book>): Promise<ICollection<Book>> {
    const { filter, page, sort, fields } = options || {};

    const [items, itemCount] = await this.repository.findAndCount({
      where: filter,
      order: sort,
      select: fields,
      take: page.size,
      skip: page.offset,
    });

    return {
      data: items,
      pageNumber: page.number,
      pageSize: page.size,
      pageCount: Math.ceil(itemCount / page.size),
      itemCount,
    };
  }

  async getOneByIdOrFail(id: number): Promise<Book> {
    const book = await this.repository.findOne({
      where: { id },
    });

    if (!book) {
      throw new BookNotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async getOneById(id: number): Promise<Book> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async saveOne(book: Book): Promise<Book> {
    return this.repository.save(book);
  }

  async updateOneOrFail(
    id: number,
    updates: Partial<Omit<Book, 'id'>>,
  ): Promise<Book> {
    const bookToUpdate = await this.repository.preload({
      ...updates,
      id,
    });

    if (!bookToUpdate) {
      throw new BookNotFoundException(`Book with ID ${id} not found`);
    }

    return this.repository.save(bookToUpdate);
  }

  async deleteOneOrFail(id: number): Promise<void> {
    const bookToDelete = await this.repository.findOne({ where: { id } });

    if (!bookToDelete) {
      throw new BookNotFoundException(`Book with ID ${id} not found`);
    }

    await this.repository.softDelete(id);
  }
}
