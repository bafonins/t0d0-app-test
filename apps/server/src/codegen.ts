import { NestFactory } from '@nestjs/core';
import {
  GraphQLSchemaFactory,
  GraphQLSchemaBuilderModule,
} from '@nestjs/graphql';
import { TodoResolver } from './todos/todo.resolver';
import { printSchema } from 'graphql';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

export async function generateSchema(schemaFile: string) {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  await app.init();

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create([TodoResolver]);

  try {
    await fs.writeFile(
      join(process.cwd(), '../../', schemaFile),
      printSchema(schema),
      'utf-8',
    );
  } catch (e) {
    throw new Error('Failed to generate graphql schema');
  }
}
