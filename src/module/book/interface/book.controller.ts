import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/page-query-params.dto';

import { BookFieldsQueryParamsDto } from '@book/application/dto/book-fields-query-params.dto';
import { BookFilterQueryParamsDto } from '@book/application/dto/book-filter-query-params.dto';
import { BookResponseDto } from '@book/application/dto/book-response.dto';
import { BookSortQueryParamsDto } from '@book/application/dto/book-sort-query-params.dto';
import { CreateBookDto } from '@book/application/dto/create-book.dto';
import { UpdateBookDto } from '@book/application/dto/update-book.dto';
import { CreateBookPolicyHandler } from '@book/application/policy/create-book-policy.handler';
import { DeleteBookPolicyHandler } from '@book/application/policy/delete-book-policy.handler';
import { ReadBookPolicyHandler } from '@book/application/policy/read-book-policy.handler';
import { UpdateBookPolicyHandler } from '@book/application/policy/update-book-policy.handler';
import { BookService } from '@book/application/service/book.service';

import { Policies } from '@iam/authorization/infrastructure/policy/decorator/policy.decorator';
import { PoliciesGuard } from '@iam/authorization/infrastructure/policy/guard/policy.guard';

@Controller('book')
@UseGuards(PoliciesGuard)
@ApiTags('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @Policies(ReadBookPolicyHandler)
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: BookFilterQueryParamsDto,
    @Query('fields') fields: BookFieldsQueryParamsDto,
    @Query('sort') sort: BookSortQueryParamsDto,
  ): Promise<CollectionDto<BookResponseDto>> {
    return this.bookService.getAll({
      page,
      filter,
      sort,
      fields: fields.target,
    });
  }

  @Get(':id')
  @Policies(ReadBookPolicyHandler)
  async getOneByIdOrFail(@Param('id') id: number): Promise<BookResponseDto> {
    return this.bookService.getOneByIdOrFail(id);
  }

  @Post()
  @Policies(CreateBookPolicyHandler)
  async saveOne(
    @Body() createBookDto: CreateBookDto,
  ): Promise<BookResponseDto> {
    return this.bookService.saveOne(createBookDto);
  }

  @Patch(':id')
  @Policies(UpdateBookPolicyHandler)
  async updateOneOrFail(
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<BookResponseDto> {
    return this.bookService.updateOneOrFail(id, updateBookDto);
  }

  @Delete(':id')
  @Policies(DeleteBookPolicyHandler)
  async deleteOneOrFail(@Param('id') id: number): Promise<void> {
    return this.bookService.deleteOneOrFail(id);
  }
}
