import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LoginPage from '@/pages/login/LoginPage'
import ObrasPage from '@/pages/dashboard/ObrasPage'
import ObraDetallePage from '@/pages/dashboard/ObraDetallePage'

export default function App() {
  const { state } = useAuth()

  if (state.status === 'loading') {
    return (
      <div className="h-screen bg-[#F8F6F1] flex items-center justify-center">
        <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#6B7280]">
          Cargando...
        </span>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={state.status === 'unauthenticated' ? <LoginPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/"
        element={state.status === 'authenticated' ? <ObrasPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/obras/:id"
        element={state.status === 'authenticated' ? <ObraDetallePage /> : <Navigate to="/login" replace />}
      />
      
    </Routes>
  )
}