/*
  Warnings:

  - You are about to alter the column `cantidad` on the `DetalleMaterial` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `precioUnitario` on the `DetalleMaterial` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `precio` on the `ManoDeObra` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetalleMaterial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precioUnitario" DECIMAL NOT NULL,
    "cantidad" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "materialId" INTEGER NOT NULL,
    "tareaId" INTEGER NOT NULL,
    CONSTRAINT "DetalleMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetalleMaterial_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DetalleMaterial" ("cantidad", "createdAt", "id", "materialId", "precioUnitario", "tareaId", "updatedAt") SELECT "cantidad", "createdAt", "id", "materialId", "precioUnitario", "tareaId", "updatedAt" FROM "DetalleMaterial";
DROP TABLE "DetalleMaterial";
ALTER TABLE "new_DetalleMaterial" RENAME TO "DetalleMaterial";
CREATE TABLE "new_ManoDeObra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precio" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "encargadoId" INTEGER,
    "tareaId" INTEGER NOT NULL,
    CONSTRAINT "ManoDeObra_encargadoId_fkey" FOREIGN KEY ("encargadoId") REFERENCES "Encargado" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ManoDeObra_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ManoDeObra" ("createdAt", "encargadoId", "id", "precio", "tareaId", "updatedAt") SELECT "createdAt", "encargadoId", "id", "precio", "tareaId", "updatedAt" FROM "ManoDeObra";
DROP TABLE "ManoDeObra";
ALTER TABLE "new_ManoDeObra" RENAME TO "ManoDeObra";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
