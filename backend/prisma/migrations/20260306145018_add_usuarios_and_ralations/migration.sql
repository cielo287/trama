/*
  Warnings:

  - Added the required column `usuarioId` to the `Encargado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Obra` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Encargado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Encargado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Encargado" ("apellido", "createdAt", "id", "nombre", "telefono", "updatedAt") SELECT "apellido", "createdAt", "id", "nombre", "telefono", "updatedAt" FROM "Encargado";
DROP TABLE "Encargado";
ALTER TABLE "new_Encargado" RENAME TO "Encargado";
CREATE TABLE "new_Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "unidadDeMedida" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Material_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Material" ("createdAt", "id", "nombre", "unidadDeMedida", "updatedAt") SELECT "createdAt", "id", "nombre", "unidadDeMedida", "updatedAt" FROM "Material";
DROP TABLE "Material";
ALTER TABLE "new_Material" RENAME TO "Material";
CREATE TABLE "new_Obra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Obra_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Obra" ("createdAt", "id", "nombre", "updateAt") SELECT "createdAt", "id", "nombre", "updateAt" FROM "Obra";
DROP TABLE "Obra";
ALTER TABLE "new_Obra" RENAME TO "Obra";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
