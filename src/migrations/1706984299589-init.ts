import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1706984299589 implements MigrationInterface {
    name = 'Init1706984299589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "modified" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."properties_type_enum" AS ENUM('number', 'string', 'boolean')`);
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "modified" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" "public"."properties_type_enum" NOT NULL, "category" uuid, CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."item-properties_type_enum" AS ENUM('number', 'string', 'boolean')`);
        await queryRunner.query(`CREATE TABLE "item-properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "modified" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" "public"."item-properties_type_enum" NOT NULL, "metadata" jsonb NOT NULL, "category" uuid, CONSTRAINT "PK_0749130adde33d456c8e1e86160" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item-categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "modified" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_b85b22df4bc6097446f61b31962" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "modified" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "category" uuid, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_788ff519ace064755e87fa90ee7" FOREIGN KEY ("category") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item-properties" ADD CONSTRAINT "FK_77957ace5671adde52506e70fc6" FOREIGN KEY ("category") REFERENCES "item-categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_2d524663c5c31e40661acbdfb2c" FOREIGN KEY ("category") REFERENCES "item-categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_2d524663c5c31e40661acbdfb2c"`);
        await queryRunner.query(`ALTER TABLE "item-properties" DROP CONSTRAINT "FK_77957ace5671adde52506e70fc6"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_788ff519ace064755e87fa90ee7"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TABLE "item-categories"`);
        await queryRunner.query(`DROP TABLE "item-properties"`);
        await queryRunner.query(`DROP TYPE "public"."item-properties_type_enum"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TYPE "public"."properties_type_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
