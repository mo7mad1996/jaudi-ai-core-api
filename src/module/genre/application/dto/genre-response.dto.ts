import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenreResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiPropertyOptional()
  deletedAt?: string;
}
