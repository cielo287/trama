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
    CONSTRAINT "DetalleMaterial_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DetalleMaterial" ("cantidad", "createdAt", "id", "materialId", "precioUnitario", "tareaId", "unidadDeMedida", "updatedAt") SELECT "cantidad", "createdAt", "id", "materialId", "precioUnitario", "tareaId", "unidadDeMedida", "updatedAt" FROM "DetalleMaterial";
DROP TABLE "DetalleMaterial";
ALTER TABLE "new_DetalleMaterial" RENAME TO "DetalleMaterial";
CREATE TABLE "new_ImagenTarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "tareaId" INTEGER NOT NULL,
    CONSTRAINT "ImagenTarea_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ImagenTarea" ("id", "tareaId", "url") SELECT "id", "tareaId", "url" FROM "ImagenTarea";
DROP TABLE "ImagenTarea";
ALTER TABLE "new_ImagenTarea" RENAME TO "ImagenTarea";
CREATE TABLE "new_ManoDeObra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precio" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "encargadoId" INTEGER,
    "tareaId" INTEGER NOT NULL,
    CONSTRAINT "ManoDeObra_encargadoId_fkey" FOREIGN KEY ("encargadoId") REFERENCES "Encargado" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ManoDeObra_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ManoDeObra" ("createdAt", "encargadoId", "id", "precio", "tareaId", "updatedAt") SELECT "createdAt", "encargadoId", "id", "precio", "tareaId", "updatedAt" FROM "ManoDeObra";
DROP TABLE "ManoDeObra";
ALTER TABLE "new_ManoDeObra" RENAME TO "ManoDeObra";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
