import { InferSubjects } from '@casl/ability';

import { Book } from '@book/domain/book.entity';

import { Genre } from '@genre/domain/genre.entity';

import { User } from '@iam/user/domain/user.entity';

export type AppSubjects =
  | InferSubjects<typeof User | typeof Book | typeof Genre>
  | 'all';
