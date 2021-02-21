import { Migration } from '@mikro-orm/migrations';

export class Migration20210221132505 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop index "user_username_index";');

    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
