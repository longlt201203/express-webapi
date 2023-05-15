import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1681119879126 implements MigrationInterface {
    name = 'migration1681119879126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_model" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, CONSTRAINT "PK_7d6bfa71f4d6a1fa0af1f688327" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_model"`);
    }

}
