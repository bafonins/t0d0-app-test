import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
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

  @Column({ default: false })
  @Field()
  frozen: boolean;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @ManyToOne(() => Todo, (todo) => todo.todos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  @Field(() => Todo, { nullable: true })
  parent?: Todo;

  @OneToMany(() => Todo, (todo) => todo.parent)
  @Field(() => [Todo!], { nullable: true })
  todos: Todo[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.todos)
  owner: User;
}
