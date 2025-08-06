import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { environmentConfig } from '@config/environment.config';
import { datasourceOptions } from '@config/orm.config';

import { BookModule } from '@book/book.module';

import { GenreModule } from '@genre/genre.module';

import { IamModule } from '@iam/iam.module';

import { HealthController } from '@/module/health/interface/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environmentConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        autoLoadEntities: true,
        ...datasourceOptions,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options);

        // Prevent adding the same data source more than once
        if (
          !DataSource.hasOwnProperty('isInitialized') ||
          !dataSource.isInitialized
        ) {
          await dataSource.initialize();
          addTransactionalDataSource(dataSource);
        }

        return dataSource;
      },
    }),
    IamModule,
    BookModule,
    GenreModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
