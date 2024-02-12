import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryNameUnique1706987814109 implements MigrationInterface {
    name = 'CategoryNameUnique1706987814109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name")`);
        await queryRunner.query(`CREATE INDEX "IDX_8e9b98aa753c00f790ad67c624" ON "item-categories" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8e9b98aa753c00f790ad67c624"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878"`);
    }

}
