import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PaginationInfo } from './page-info.model';

export interface IPaginatedListType<T> {
  readonly list: T[];
  readonly page: PaginationInfo;
}

export function PaginatedList<T>(
  classRef: Type<T>,
): Type<IPaginatedListType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedListType implements IPaginatedListType<T> {
    @Field(() => [classRef], { nullable: true, defaultValue: [] })
    list: T[];

    @Field(() => PaginationInfo)
    page: PaginationInfo;
  }

  return PaginatedListType as Type<IPaginatedListType<T>>;
}
