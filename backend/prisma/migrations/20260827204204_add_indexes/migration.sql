-- CreateIndex
CREATE INDEX "DetalleMaterial_materialId_idx" ON "DetalleMaterial"("materialId");

-- CreateIndex
CREATE INDEX "DetalleMaterial_tareaId_idx" ON "DetalleMaterial"("tareaId");

-- CreateIndex
CREATE INDEX "Encargado_usuarioId_idx" ON "Encargado"("usuarioId");

-- CreateIndex
CREATE INDEX "HistorialEstado_tareaId_idx" ON "HistorialEstado"("tareaId");

-- CreateIndex
CREATE INDEX "ImagenTarea_tareaId_idx" ON "ImagenTarea"("tareaId");

-- CreateIndex
CREATE INDEX "ManoDeObra_encargadoId_idx" ON "ManoDeObra"("encargadoId");

-- CreateIndex
CREATE INDEX "ManoDeObra_tareaId_idx" ON "ManoDeObra"("tareaId");

-- CreateIndex
CREATE INDEX "Material_usuarioId_idx" ON "Material"("usuarioId");

-- CreateIndex
CREATE INDEX "Obra_usuarioId_idx" ON "Obra"("usuarioId");

-- CreateIndex
CREATE INDEX "Tarea_obraId_idx" ON "Tarea"("obraId");

-- CreateIndex
CREATE INDEX "Tarea_tareaPadreId_idx" ON "Tarea"("tareaPadreId");

-- CreateIndex
CREATE INDEX "TareaDependencia_bloqueadoraId_idx" ON "TareaDependencia"("bloqueadoraId");

-- CreateIndex
CREATE INDEX "TareaDependencia_dependienteId_idx" ON "TareaDependencia"("dependienteId");
