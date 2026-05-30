/*
  Warnings:

  - You are about to drop the `Rubro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EncargadoToRubro` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Rubro";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_EncargadoToRubro";
PRAGMA foreign_keys=on;
