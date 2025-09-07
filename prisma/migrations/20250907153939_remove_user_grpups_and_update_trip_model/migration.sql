/*
  Warnings:

  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserGroup` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costPerPerson` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indoor` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Trip" DROP CONSTRAINT "Trip_userGroupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserToUserGroup" DROP CONSTRAINT "_UserToUserGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserToUserGroup" DROP CONSTRAINT "_UserToUserGroup_B_fkey";

-- AlterTable
ALTER TABLE "public"."Trip" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "costPerPerson" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "indoor" BOOLEAN NOT NULL,
ADD COLUMN     "link" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."UserGroup";

-- DropTable
DROP TABLE "public"."_UserToUserGroup";

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userGroupId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
