import { Injectable } from '@nestjs/common';

import { BookResponseDto } from '@book/application/dto/book-response.dto';
import { ICreateBookDto } from '@book/application/dto/create-book.dto.interface';
import { IUpdateBookDto } from '@book/application/dto/update-book.dto.interface';
import { Book } from '@book/domain/book.entity';

@Injectable()
export class BookMapper {
  fromCreateBookDtoToBook(bookDto: ICreateBookDto): Book {
    const book = new Book();
    book.title = bookDto.title;
    book.description = bookDto.description;
    return book;
  }

  fromUpdateBookDtoToBook(bookDto: IUpdateBookDto): Book {
    const book = new Book();
    book.title = bookDto.title;
    book.description = bookDto.description;
    return book;
  }

  fromBookToBookResponseDto(book: Book): BookResponseDto {
    const bookResponseDto = new BookResponseDto();
    bookResponseDto.id = book.id;
    bookResponseDto.title = book.title;
    bookResponseDto.description = book.description;
    bookResponseDto.createdAt = book.createdAt;
    bookResponseDto.updatedAt = book.updatedAt;
    bookResponseDto.deletedAt = book.deletedAt;
    return bookResponseDto;
  }
}
