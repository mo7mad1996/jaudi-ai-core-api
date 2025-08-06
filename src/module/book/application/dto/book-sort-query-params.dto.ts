import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { SortType } from '@common/base/application/enum/sort-type.enum';

export class BookSortQueryParamsDto {
  @ApiPropertyOptional()
  @IsEnum(SortType)
  @IsOptional()
  title?: SortType;
}
