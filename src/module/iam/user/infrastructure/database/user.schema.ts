import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

import { User } from '@iam/user/domain/user.entity';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  tableName: 'user',
  columns: withBaseSchemaColumns({
    username: {
      type: String,
      unique: true,
    },
    externalId: {
      type: String,
      unique: true,
      nullable: true,
    },
    roles: {
      type: 'simple-array',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  }),
});
