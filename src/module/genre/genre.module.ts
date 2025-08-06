import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GenreMapper } from '@genre/application/mapper/genre.mapper';
import { CreateGenrePolicyHandler } from '@genre/application/policy/create-genre-policy.handler';
import { DeleteGenrePolicyHandler } from '@genre/application/policy/delete-genre-policy.handler';
import { ReadGenrePolicyHandler } from '@genre/application/policy/read-genre-policy.handler';
import { UpdateGenrePolicyHandler } from '@genre/application/policy/update-genre-policy.handler';
import { GENRE_REPOSITORY_KEY } from '@genre/application/repository/genre.repository.interface';
import { GenreService } from '@genre/application/service/genre.service';
import { genrePermissions } from '@genre/domain/genre.permission';
import { GenreMysqlRepository } from '@genre/infrastructure/database/genre.mysql.repository';
import { GenreSchema } from '@genre/infrastructure/database/genre.schema';
import { GenreController } from '@genre/interface/genre.controller';

import { AuthorizationModule } from '@iam/authorization/authorization.module';

const policyHandlersProviders = [
  ReadGenrePolicyHandler,
  CreateGenrePolicyHandler,
  UpdateGenrePolicyHandler,
  DeleteGenrePolicyHandler,
];

const genreRepositoryProvider: Provider = {
  provide: GENRE_REPOSITORY_KEY,
  useClass: GenreMysqlRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([GenreSchema]),
    AuthorizationModule.forFeature({ permissions: genrePermissions }),
  ],
  controllers: [GenreController],
  providers: [
    GenreMapper,
    GenreService,
    genreRepositoryProvider,
    ...policyHandlersProviders,
  ],
  exports: [GenreMapper, GenreService, genreRepositoryProvider],
})
export class GenreModule {}
