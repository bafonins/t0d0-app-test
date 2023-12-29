import { GraphQLResolveInfo } from 'graphql';
import { fieldsList } from 'graphql-fields-list';

export class FieldMaskDto {
  public fields: string[];

  constructor(fields: string[]) {
    this.fields = fields;
  }

  static fromGqlInfo<T>(
    info: GraphQLResolveInfo,
    exclude: Array<keyof T> = [],
  ): FieldMaskDto {
    const fieldName = info.fieldName;
    const skipPaths = ['__*', ...(exclude as string[])];

    const fieldMask = fieldsList(info, { skip: skipPaths }).map(
      (key) => `${fieldName}.${key}`,
    );

    return new FieldMaskDto(fieldMask);
  }
}
