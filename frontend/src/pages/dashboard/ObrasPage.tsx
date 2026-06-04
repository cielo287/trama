import React, { useState } from 'react';
import { useObras } from '@/hooks/useObras';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import NuevaObraModal from '@/components/NuevaObraModal';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Obra } from '@/types';
import { MapPin, User, Pencil, Trash2, Calendar, HardHat, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function ObrasPage() {
  const { obras, loading, actionLoading, crear, editar, eliminar } = useObras();
  const { state } = useAuth();
  const nombre = state.status === 'authenticated' ? state.usuario.nombre : '';
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Obra | null>(null);
  const [obraAEliminar, setObraAEliminar] = useState<Obra | null>(null);

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-[#F8F6F1]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-[#A44A3F]/20 border-t-[#A44A3F] rounded-full animate-spin" />
            <HardHat className="w-5 h-5 text-[#A44A3F] absolute animate-pulse" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#6B7280] ml-1 select-none">
            Cargando obras...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F8F6F1] select-none text-[#333333]">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-10">
          {obras.length === 0 ? (
            <ObrasVacia
              nombre={nombre}
              onNuevaObra={() => setModalAbierto(true)}
            />
          ) : (
            <ObrasLista
              obras={obras}
              onEditar={setEditando}
              onEliminar={setObraAEliminar}
              loading={actionLoading}
            />
          )}
        </div>
      </main>

      {/* Pulsing Floating Action Button styled elegantly */}
      {obras.length > 0 && (
        <button
          onClick={() => setModalAbierto(true)}
          title="Agregar Nueva Obra"
          className="fixed bottom-10 right-10 w-15 h-15 bg-[#A44A3F] text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#8e3f35] active:scale-95 shadow-xl shadow-[#A44A3F]/25 hover:shadow-[#A44A3F]/40 z-50 group cursor-pointer"
        >
          <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
        </button>
      )}

      {/* Modals & Dialogs */}
      <NuevaObraModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onConfirm={crear}
        loading={actionLoading}
      />
      
      {editando && (
        <NuevaObraModal
          open={!!editando}
          onClose={() => setEditando(null)}
          onConfirm={data => editar(editando!.id, data)}
          loading={actionLoading}
          titulo="Editar obra"
          initialData={{
            nombre: editando.nombre,
            direccion: editando.direccion ?? '',
            cliente: editando.cliente ?? '',
          }}
        />
      )}

      <ConfirmDialog
        open={!!obraAEliminar}
        title="Eliminar obra"
        message={`¿Seguro que querés eliminar la obra "${obraAEliminar?.nombre}"? Esta acción no se puede deshacer y borrará los registros asociados.`}
        confirmText="Eliminar permanentemente"
        cancelText="Conservar"
        onCancel={() => setObraAEliminar(null)}
        onConfirm={async () => {
          if (!obraAEliminar) return;
          await eliminar(obraAEliminar.id);
          setObraAEliminar(null);
        }}
      />
    </div>
  );
}

function ObrasVacia({ nombre, onNuevaObra }: { nombre: string; onNuevaObra: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-12">
      <div className="text-center space-y-4">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#A44A3F] uppercase font-bold">
          Bienvenido de vuelta
        </span>
        <h1 className="text-5xl md:text-6xl font-extralight text-[#333333] tracking-tight">
          ¡Hola, {nombre}!
        </h1>
        <p className="font-mono text-[11px] text-[#6B7280] uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">
          Parece que todavía no hay obras registradas en tu estudio
        </p>
      </div>

      <div className="w-full max-w-sm">
        <button
          onClick={onNuevaObra}
          className="w-full aspect-video border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center gap-5 hover:border-[#A44A3F]/50 hover:bg-white/40 transition-all group rounded-xs cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#A44A3F] rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-[#8e3f35] shadow-md shadow-[#A44A3F]/15">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div className="text-center space-y-1">
            <span className="block font-mono text-[11px] text-[#333333] uppercase tracking-widest font-bold group-hover:text-[#A44A3F] transition-colors">
              Comenzar nueva obra
            </span>
            <span className="block font-mono text-[9px] text-[#6B7280] uppercase tracking-widest opacity-70">
              Registrar dirección y cliente
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

function ObrasLista({
  obras,
  onEditar,
  onEliminar,
  loading,
}: {
  obras: Obra[];
  onEditar: (obra: Obra) => void;
  onEliminar: (obra: Obra) => void;
  loading: boolean;
}) {
  const navigate = useNavigate();

  // Framer Motion container & card variants for stunning staggered entrances
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Title & Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#333333]/15 pb-4">
        <div>
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#A44A3F] uppercase font-bold">
            Listado General
          </span>
          <h2 className="text-3xl font-light tracking-tight text-[#333333] mt-1">
            Mis Obras
          </h2>
        </div>
        <div className="font-mono text-[10px] tracking-widest uppercase text-gray-500 bg-white/40 border border-gray-200/50 py-1.5 px-3 rounded-full shadow-2xs">
          {obras.length} {obras.length === 1 ? 'PROYECTO ACTIVO' : 'PROYECTOS ACTIVOS'}
        </div>
      </div>

      {/* Grid rendering list of Obras */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-28"
      >
        {obras.map(obra => (
          <motion.div
            key={obra.id}
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => navigate(`/obras/${obra.id}`)}
            className="relative bg-white border border-gray-200 p-6 shadow-xs hover:shadow-lg hover:border-[#A44A3F]/25 transition-all cursor-pointer group flex flex-col justify-between min-h-[220px] rounded-xs"
          >
            {/* Elegant corner blueprint bracket markings */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t border-l border-gray-300 group-hover:border-[#A44A3F]/50 transition-colors duration-300" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t border-r border-gray-300 group-hover:border-[#A44A3F]/50 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l border-gray-300 group-hover:border-[#A44A3F]/50 transition-colors duration-300" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b border-r border-gray-300 group-hover:border-[#A44A3F]/50 transition-colors duration-300" />

            {/* Top Row: Tag & Action Buttons */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#6B7280] font-bold group-hover:text-[#A44A3F] transition-colors duration-300">
                PROYECTO EN CURSO
              </span>

              {/* Action Buttons: Redesigned cleanly with intuitive icons and beautiful hover states */}
              <div
                className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => onEditar(obra)}
                  title="Editar Obra"
                  className="w-8 h-8 rounded-full border border-gray-200/80 bg-[#F8F6F1]/30 flex items-center justify-center text-gray-500 hover:text-[#A44A3F] hover:bg-[#A44A3F]/5 hover:border-[#A44A3F]/20 transition-all cursor-pointer shadow-2xs active:scale-90"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onEliminar(obra)}
                  title="Eliminar Obra"
                  className="w-8 h-8 rounded-full border border-gray-200/80 bg-[#F8F6F1]/30 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer shadow-2xs active:scale-90"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Core Card Section: Obra Name */}
            <div className="space-y-4 mb-5 flex-1 flex flex-col justify-center">
              <h3 className="text-3xl font-light text-[#333333] tracking-tight group-hover:text-[#A44A3F] transition-colors duration-300">
                {obra.nombre}
              </h3>

              {/* Redesigned content containing Address & Client info with crisp icons */}
              <div className="space-y-2 border-t border-[#333333]/5 pt-3">
                {/* Dirección / Address */}
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A44A3F]/80 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="block font-mono text-[12px] uppercase tracking-wider text-gray-400 font-bold">
                      Dirección
                    </span>
                    <span className="text-xs text-gray-600 line-clamp-1 font-light">
                      {obra.direccion || 'Dirección no registrada'}
                    </span>
                  </div>
                </div>

                {/* Cliente / Client */}
                <div className="flex items-start gap-2.5">
                  <User className="w-3.5 h-3.5 text-[#A44A3F]/80 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="block font-mono text-[12px] uppercase tracking-wider text-gray-400 font-bold">
                      Cliente
                    </span>
                    <span className="text-xs text-gray-600 line-clamp-1 font-light">
                      {obra.cliente || 'Cliente no registrado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: ISO Sourced Argentine Date Stamp */}

          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}