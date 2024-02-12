import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeTypeString1707327757517 implements MigrationInterface {
    name = 'MakeTypeString1707327757517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item-properties" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."item-properties_type_enum"`);
        await queryRunner.query(`ALTER TABLE "item-properties" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."properties_type_enum"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."properties_type_enum" AS ENUM('number', 'string', 'boolean')`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "type" "public"."properties_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item-properties" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."item-properties_type_enum" AS ENUM('number', 'string', 'boolean')`);
        await queryRunner.query(`ALTER TABLE "item-properties" ADD "type" "public"."item-properties_type_enum" NOT NULL`);
    }

}
