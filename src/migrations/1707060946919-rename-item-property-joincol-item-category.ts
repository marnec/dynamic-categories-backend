import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameItemPropertyJoincolItemCategory1707060946919 implements MigrationInterface {
    name = 'RenameItemPropertyJoincolItemCategory1707060946919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item-properties" DROP CONSTRAINT "FK_77957ace5671adde52506e70fc6"`);
        await queryRunner.query(`ALTER TABLE "item-properties" RENAME COLUMN "category" TO "item-category"`);
        await queryRunner.query(`ALTER TABLE "item-properties" ADD CONSTRAINT "FK_97810d635e49ddd4816eaee4061" FOREIGN KEY ("item-category") REFERENCES "item-categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item-properties" DROP CONSTRAINT "FK_97810d635e49ddd4816eaee4061"`);
        await queryRunner.query(`ALTER TABLE "item-properties" RENAME COLUMN "item-category" TO "category"`);
        await queryRunner.query(`ALTER TABLE "item-properties" ADD CONSTRAINT "FK_77957ace5671adde52506e70fc6" FOREIGN KEY ("category") REFERENCES "item-categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
