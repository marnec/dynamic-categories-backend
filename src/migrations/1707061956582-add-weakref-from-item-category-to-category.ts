import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWeakrefFromItemCategoryToCategory1707061956582 implements MigrationInterface {
    name = 'AddWeakrefFromItemCategoryToCategory1707061956582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item-categories" ADD "templateCategory" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item-categories" ADD "inSync" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item-categories" DROP COLUMN "inSync"`);
        await queryRunner.query(`ALTER TABLE "item-categories" DROP COLUMN "templateCategory"`);
    }

}
