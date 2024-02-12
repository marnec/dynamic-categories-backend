import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraints1707146363104 implements MigrationInterface {
    name = 'AddUniqueConstraints1707146363104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_19b332d0f2c37d7d873661c479" ON "item-properties" ("name") `);
        await queryRunner.query(`ALTER TABLE "item-properties" ADD CONSTRAINT "UQ_05a77fa73c343635a3af5fc1ebc" UNIQUE ("item-category", "name")`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "UQ_ba3669c7c48c0d9e2a1965d50c5" UNIQUE ("category", "name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "UQ_ba3669c7c48c0d9e2a1965d50c5"`);
        await queryRunner.query(`ALTER TABLE "item-properties" DROP CONSTRAINT "UQ_05a77fa73c343635a3af5fc1ebc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19b332d0f2c37d7d873661c479"`);
    }

}
