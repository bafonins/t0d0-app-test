import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Todo } from '../../todos/models/todo.model';

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

  @Field(() => [Todo], { defaultValue: [], nullable: true })
  @OneToMany(() => Todo, (todo) => todo.owner, { nullable: true })
  todos: Todo[];
}
