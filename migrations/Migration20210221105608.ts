import { Migration } from '@mikro-orm/migrations';

export class Migration20210221105608 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "fullname" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "birthdate" timestamptz(0) null);');
    this.addSql('create index "user_username_index" on "user" ("username");');
  }

}
