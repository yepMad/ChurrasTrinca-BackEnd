import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreatePartiesUsers1628143036542
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'parties_users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'party_id',
            type: 'uuid',
          },
          {
            name: 'general_value',
            type: 'numeric',
          },
          {
            name: 'drinks_value',
            type: 'numeric',
          },
          {
            name: 'itsPaid',
            type: 'boolean',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'PartiesUsers_User',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'PartiesUsers_Party',
            referencedTableName: 'parties',
            referencedColumnNames: ['id'],
            columnNames: ['party_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('parties_users');
  }
}
