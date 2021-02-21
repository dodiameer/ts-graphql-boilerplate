import { Entity, Index, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @PrimaryKey()
  @Field()
  id!: number;

  @Property()
  @Field((type) => Date)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field((type) => Date)
  updatedAt: Date = new Date();

  @Property()
  @Unique()
  @Field()
  username!: string;

  @Property()
  @Field()
  fullname!: string;

  @Property()
  @Field()
  @Unique()
  email!: string;

  @Property()
  password!: string;

  @Property({ nullable: true })
  @Field((type) => Date, { nullable: true })
  birthdate?: Date;
}
