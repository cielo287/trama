-- CreateTable
CREATE TABLE "Obra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" DATETIME,
    "fechaFin" DATETIME,
    "ordenEjecucion" INTEGER,
    "prioridad" TEXT,
    "estado" TEXT,
    "imagenesUrls" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "obraId" INTEGER NOT NULL,
    "tareaPadreId" INTEGER,
    CONSTRAINT "Tarea_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarea_tareaPadreId_fkey" FOREIGN KEY ("tareaPadreId") REFERENCES "Tarea" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "unidadDeMedida" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DetalleMaterial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precioUnitario" REAL NOT NULL,
    "cantidad" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "materialId" INTEGER NOT NULL,
    "tareaId" INTEGER NOT NULL,
    CONSTRAINT "DetalleMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetalleMaterial_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rubro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Encargado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ManoDeObra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precio" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "encargadoId" INTEGER,
    "tareaId" INTEGER NOT NULL,
    CONSTRAINT "ManoDeObra_encargadoId_fkey" FOREIGN KEY ("encargadoId") REFERENCES "Encargado" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ManoDeObra_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EncargadoToRubro" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EncargadoToRubro_A_fkey" FOREIGN KEY ("A") REFERENCES "Encargado" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EncargadoToRubro_B_fkey" FOREIGN KEY ("B") REFERENCES "Rubro" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Rubro_nombre_key" ON "Rubro"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "_EncargadoToRubro_AB_unique" ON "_EncargadoToRubro"("A", "B");

-- CreateIndex
CREATE INDEX "_EncargadoToRubro_B_index" ON "_EncargadoToRubro"("B");
