import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('todos')
@ObjectType()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  title: string;

  @Column({ default: false })
  @Field()
  completed: boolean;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @ManyToOne(() => Todo, (todo) => todo.todos)
  @Field(() => Todo, { nullable: true })
  parent?: Todo;

  @OneToMany(() => Todo, (todo) => todo.parent)
  @Field(() => [Todo!], { nullable: true })
  todos: Todo[];
}
