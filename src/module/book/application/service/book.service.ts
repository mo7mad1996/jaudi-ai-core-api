import { Inject, Injectable } from '@nestjs/common';

import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { IGetAllOptions } from '@common/base/application/interface/get-all-options.interface';

import { BookResponseDto } from '@book/application/dto/book-response.dto';
import { ICreateBookDto } from '@book/application/dto/create-book.dto.interface';
import { IUpdateBookDto } from '@book/application/dto/update-book.dto.interface';
import { BookMapper } from '@book/application/mapper/book.mapper';
import {
  BOOK_REPOSITORY_KEY,
  IBookRepository,
} from '@book/application/repository/book.repository.interface';
import { Book } from '@book/domain/book.entity';

@Injectable()
export class BookService {
  constructor(
    @Inject(BOOK_REPOSITORY_KEY)
    private readonly bookRepository: IBookRepository,
    private readonly bookMapper: BookMapper,
  ) {}

  async getAll(
    options: IGetAllOptions<Book>,
  ): Promise<CollectionDto<BookResponseDto>> {
    const collection = await this.bookRepository.getAll(options);
    return new CollectionDto({
      ...collection,
      data: collection.data.map((book) =>
        this.bookMapper.fromBookToBookResponseDto(book),
      ),
    });
  }

  async getOneByIdOrFail(id: number): Promise<BookResponseDto> {
    const book = await this.bookRepository.getOneByIdOrFail(id);
    return this.bookMapper.fromBookToBookResponseDto(book);
  }

  async saveOne(createBookDto: ICreateBookDto): Promise<BookResponseDto> {
    const book = await this.bookRepository.saveOne(
      this.bookMapper.fromCreateBookDtoToBook(createBookDto),
    );
    return this.bookMapper.fromBookToBookResponseDto(book);
  }

  async updateOneOrFail(
    id: number,
    updateBookDto: IUpdateBookDto,
  ): Promise<BookResponseDto> {
    const book = await this.bookRepository.updateOneOrFail(
      id,
      this.bookMapper.fromUpdateBookDtoToBook(updateBookDto),
    );
    return this.bookMapper.fromBookToBookResponseDto(book);
  }

  async deleteOneOrFail(id: number): Promise<void> {
    return this.bookRepository.deleteOneOrFail(id);
  }
}
