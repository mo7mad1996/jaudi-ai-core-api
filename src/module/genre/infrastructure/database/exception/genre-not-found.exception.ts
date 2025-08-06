import { NotFoundException } from '@nestjs/common';

export class GenreNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
