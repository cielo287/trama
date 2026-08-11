-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "codigoExpiracion" TIMESTAMP(3),
ADD COLUMN     "codigoVerificacion" TEXT,
ADD COLUMN     "verificado" BOOLEAN NOT NULL DEFAULT false;
