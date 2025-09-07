/*
  Warnings:

  - You are about to drop the column `userGroupId` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Trip" DROP COLUMN "userGroupId",
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "costPerPerson" DROP NOT NULL,
ALTER COLUMN "costPerPerson" SET DEFAULT 0,
ALTER COLUMN "indoor" SET DEFAULT false,
ALTER COLUMN "link" DROP NOT NULL;
