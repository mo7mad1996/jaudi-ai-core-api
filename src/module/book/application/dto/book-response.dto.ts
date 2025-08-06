import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiPropertyOptional()
  deletedAt?: string;
}
