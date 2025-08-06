import { Inject } from '@nestjs/common';

import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { IGetAllOptions } from '@common/base/application/interface/get-all-options.interface';

import { ICreateGenreDto } from '@genre/application/dto/create-genre.dto.interface';
import { GenreResponseDto } from '@genre/application/dto/genre-response.dto';
import { IUpdateGenreDto } from '@genre/application/dto/update-genre.dto.interface';
import { GenreMapper } from '@genre/application/mapper/genre.mapper';
import {
  GENRE_REPOSITORY_KEY,
  IGenreRepository,
} from '@genre/application/repository/genre.repository.interface';
import { Genre } from '@genre/domain/genre.entity';

export class GenreService {
  constructor(
    @Inject(GENRE_REPOSITORY_KEY) readonly genreRepository: IGenreRepository,
    private readonly genreMapper: GenreMapper,
  ) {}

  async getAll(
    options?: IGetAllOptions<Genre>,
  ): Promise<CollectionDto<GenreResponseDto>> {
    const collection = await this.genreRepository.getAll(options);
    return new CollectionDto({
      ...collection,
      data: collection.data.map((genre) =>
        this.genreMapper.fromGenretoGenreResponseDto(genre),
      ),
    });
  }

  async getOneByIdOrFail(id: number): Promise<GenreResponseDto> {
    const genre = await this.genreRepository.getOneByIdOrFail(id);
    return this.genreMapper.fromGenretoGenreResponseDto(genre);
  }

  async saveOne(createGenreDto: ICreateGenreDto): Promise<GenreResponseDto> {
    const genre = await this.genreRepository.saveOne(
      this.genreMapper.fromCreateGenreDtoToGenre(createGenreDto),
    );
    return this.genreMapper.fromGenretoGenreResponseDto(genre);
  }

  async updateOne(
    id: number,
    updateGenreDto: IUpdateGenreDto,
  ): Promise<GenreResponseDto> {
    const genre = await this.genreRepository.updateOneOrFail(
      id,
      this.genreMapper.fromUpdateGenreDtoToGenre(updateGenreDto),
    );
    return this.genreMapper.fromGenretoGenreResponseDto(genre);
  }

  async deleteOneOrFail(id: number): Promise<void> {
    await this.genreRepository.deleteOneOrFail(id);
  }
}
