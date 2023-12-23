import { Field, ID, ObjectType } from '@nestjs/graphql';
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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Todo, (todo) => todo.children)
  @Field((type) => Todo, { nullable: true })
  parent?: Todo;

  @OneToMany((type) => Todo, (todo) => todo.parent)
  @Field((type) => [Todo], { nullable: true })
  children: Todo[];
}
