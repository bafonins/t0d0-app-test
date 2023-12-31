import { registerEnumType } from '@nestjs/graphql';

export enum TodoFilterType {
  ALL = 'ALL',
  COMPLETED = 'COMPLETED',
  ACTIVE = 'ACTIVE',
}

registerEnumType(TodoFilterType, { name: 'TodoFilterType' });
