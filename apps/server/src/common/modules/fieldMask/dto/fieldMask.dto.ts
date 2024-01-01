import { GraphQLResolveInfo } from 'graphql';
import { fieldsList } from 'graphql-fields-list';

export class FieldMaskDto {
  public fields: string[];

  constructor(fields: string[]) {
    this.fields = fields;
  }

  hasField<T>(fieldName: keyof T): boolean {
    return this.fields.some((field) => field.split('.')[1] === fieldName);
  }

  static fromGqlInfo<T>(
    info: GraphQLResolveInfo,
    exclude: Array<keyof T> = [],
    prefix?: string,
  ): FieldMaskDto {
    const fieldName = prefix || info.fieldName;
    const skipPaths = ['__*', ...(exclude as string[])];

    const fieldMask = fieldsList(info, { skip: skipPaths }).map(
      (key) => `${fieldName}.${key}`,
    );

    return new FieldMaskDto(fieldMask);
  }

  static fromEntity<T>(
    entity: Partial<T>,
    exclude: Array<keyof T> = [],
    prefix: string,
  ): FieldMaskDto {
    const skipPaths = exclude as string[];

    const fieldMask = Object.keys(entity)
      .filter((key) => !skipPaths.includes(key))
      .map((key) => `${prefix}.${key}`);

    return new FieldMaskDto(fieldMask);
  }
}
