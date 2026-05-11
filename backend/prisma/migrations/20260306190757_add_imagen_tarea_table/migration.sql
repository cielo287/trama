/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Obra` table. All the data in the column will be lost.
  - You are about to drop the column `imagenesUrls` on the `Tarea` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Tarea` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Obra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tarea` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ImagenTarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "tareaId" INTEGER NOT NULL,
    CONSTRAINT "ImagenTarea_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Obra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Obra_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Obra" ("createdAt", "id", "nombre", "usuarioId") SELECT "createdAt", "id", "nombre", "usuarioId" FROM "Obra";
DROP TABLE "Obra";
ALTER TABLE "new_Obra" RENAME TO "Obra";
CREATE TABLE "new_Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" DATETIME,
    "fechaFin" DATETIME,
    "ordenEjecucion" INTEGER,
    "prioridad" TEXT,
    "estado" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "obraId" INTEGER NOT NULL,
    "tareaPadreId" INTEGER,
    CONSTRAINT "Tarea_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarea_tareaPadreId_fkey" FOREIGN KEY ("tareaPadreId") REFERENCES "Tarea" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_Tarea" ("createdAt", "descripcion", "estado", "fechaFin", "fechaInicio", "id", "obraId", "ordenEjecucion", "prioridad", "tareaPadreId", "titulo") SELECT "createdAt", "descripcion", "estado", "fechaFin", "fechaInicio", "id", "obraId", "ordenEjecucion", "prioridad", "tareaPadreId", "titulo" FROM "Tarea";
DROP TABLE "Tarea";
ALTER TABLE "new_Tarea" RENAME TO "Tarea";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
