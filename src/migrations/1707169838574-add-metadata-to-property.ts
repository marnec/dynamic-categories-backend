import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMetadataToProperty1707169838574 implements MigrationInterface {
    name = 'AddMetadataToProperty1707169838574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" ADD "metadata" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "metadata"`);
    }

}
