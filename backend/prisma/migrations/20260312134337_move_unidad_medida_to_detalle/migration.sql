/*
  Warnings:

  - You are about to drop the column `unidadDeMedida` on the `Material` table. All the data in the column will be lost.
  - Added the required column `unidadDeMedida` to the `DetalleMaterial` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetalleMaterial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precioUnitario" DECIMAL NOT NULL,
    "cantidad" DECIMAL NOT NULL,
    "unidadDeMedida" TEXT NOT NULL,
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
CREATE TABLE "new_Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Material_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Material" ("createdAt", "id", "nombre", "updatedAt", "usuarioId") SELECT "createdAt", "id", "nombre", "updatedAt", "usuarioId" FROM "Material";
DROP TABLE "Material";
ALTER TABLE "new_Material" RENAME TO "Material";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
