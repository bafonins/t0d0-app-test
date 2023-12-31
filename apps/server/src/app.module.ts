import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TodosModule } from './todos/todos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos/models/todo.model';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { UsersModule } from './users/users.module';
import { User } from './users/models/user.model';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

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
        entities: [Todo, User],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        const isDev = configService.get<string>('NODE_ENV') === 'development';
        const schemaFile = configService.get<string>(
          'GQL_CODEGEN_SCHEMA',
          'schema-generated.gql',
        );

        return {
          installSubscriptionHandlers: true,
          subscriptions: {
            /*
              Use for backwards compatibility with GraphQL playground for
              development purposes.
            */
            'subscriptions-transport-ws': isDev,
            'graphql-ws': !isDev,
          },
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
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    TodosModule,
    PubSubModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
