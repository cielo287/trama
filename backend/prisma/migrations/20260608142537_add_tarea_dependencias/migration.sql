-- CreateTable
CREATE TABLE "TareaDependencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bloqueadoraId" INTEGER NOT NULL,
    "dependienteId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TareaDependencia_bloqueadoraId_fkey" FOREIGN KEY ("bloqueadoraId") REFERENCES "Tarea" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TareaDependencia_dependienteId_fkey" FOREIGN KEY ("dependienteId") REFERENCES "Tarea" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TareaDependencia_bloqueadoraId_dependienteId_key" ON "TareaDependencia"("bloqueadoraId", "dependienteId");
