import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { TodosModule } from './todos/todos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos/models/todo.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(
          'POSTGRES_HOST',
          'host.docker.internal',
        ),
        port: configService.get<number>('POSTGRES_PORT', 5432),
        username: configService.get<string>('POSTGRES_USER', 'admin'),
        password: configService.get<string>('POSTGRES_PASSWORD', '12345'),
        database: configService.get<string>('POSTGRES_DB', 'app-db'),
        entities: [Todo],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        const isDev = configService.get<string>('NODE_ENV') === 'development';
        const schemaFile = configService.get<string>(
          'GQL_CODEGEN_SCHEMA',
          'schema-generated.gql',
        );

        return {
          playground: isDev,
          autoSchemaFile: isDev
            ? join(process.cwd(), '../..', schemaFile)
            : false,
          sortSchema: true,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    TodosModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
