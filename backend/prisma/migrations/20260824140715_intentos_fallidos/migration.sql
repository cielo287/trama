-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "bloqueadoHastaCodigo" TIMESTAMP(3),
ADD COLUMN     "bloqueadoHastaLogin" TIMESTAMP(3),
ADD COLUMN     "intentosFallidosCodigo" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "intentosFallidosLogin" INTEGER NOT NULL DEFAULT 0;
