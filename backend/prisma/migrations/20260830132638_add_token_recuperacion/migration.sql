/*
  Warnings:

  - You are about to drop the column `resetPasswordExpiresAt` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordTokenHash` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "resetPasswordExpiresAt",
DROP COLUMN "resetPasswordTokenHash",
ADD COLUMN     "tokenRecuperacion" TEXT,
ADD COLUMN     "tokenRecuperacionExpira" TIMESTAMP(3);
