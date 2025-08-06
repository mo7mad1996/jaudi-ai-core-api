import { Base } from '@common/base/domain/base.entity';

export class Book extends Base {
  title: string;
  description?: string;
}
