-- CreateTable
CREATE TABLE "HistorialEstado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estado" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" DATETIME,
    "notas" TEXT,
    "tareaId" INTEGER NOT NULL,
    CONSTRAINT "HistorialEstado_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" DATETIME,
    "fechaFin" DATETIME,
    "ordenEjecucion" INTEGER,
    "prioridad" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "obraId" INTEGER NOT NULL,
    "tareaPadreId" INTEGER,
    CONSTRAINT "Tarea_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarea_tareaPadreId_fkey" FOREIGN KEY ("tareaPadreId") REFERENCES "Tarea" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_Tarea" ("createdAt", "descripcion", "estado", "fechaFin", "fechaInicio", "id", "obraId", "ordenEjecucion", "prioridad", "tareaPadreId", "titulo", "updatedAt") SELECT "createdAt", "descripcion", coalesce("estado", 'PENDIENTE') AS "estado", "fechaFin", "fechaInicio", "id", "obraId", "ordenEjecucion", "prioridad", "tareaPadreId", "titulo", "updatedAt" FROM "Tarea";
DROP TABLE "Tarea";
ALTER TABLE "new_Tarea" RENAME TO "Tarea";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
