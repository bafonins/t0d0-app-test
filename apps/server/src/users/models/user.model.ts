import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  username: string;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
