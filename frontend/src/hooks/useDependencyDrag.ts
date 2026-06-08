import { useState, useCallback, useRef, useEffect } from 'react'

export type DependencyEdge = 'start' | 'end'

export interface DragState {
  tareaId: number
  edge: DependencyEdge
  startX: number
  startY: number
  currentX: number
  currentY: number
}

interface UseDependencyDragProps {
  onConnect: (bloqueadoraId: number, dependienteId: number) => Promise<unknown>
}

export function useDependencyDrag({ onConnect }: UseDependencyDragProps) {
  const [drag, setDrag] = useState<DragState | null>(null)
  const pendingTarget = useRef<number | null>(null)

  const startDrag = useCallback((
    e: React.PointerEvent,
    tareaId: number,
    edge: DependencyEdge
  ) => {
    e.stopPropagation()
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    pendingTarget.current = null
    setDrag({
      tareaId,
      edge,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    })
  }, [])

  const moveDrag = useCallback((e: PointerEvent) => {
    setDrag(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null)
  }, [])

  // Las barras registran que son el target, pero no ejecutan nada
  const registerTarget = useCallback((tareaId: number) => {
    pendingTarget.current = tareaId
  }, [])

  const commitDrag = useCallback(() => {
    setDrag(prev => {
      if (!prev) return null
      const target = pendingTarget.current
      pendingTarget.current = null
      if (target === null || target === prev.tareaId) return null
      if (prev.edge === 'end') {
        onConnect(prev.tareaId, target)
      } else {
        onConnect(target, prev.tareaId)
      }
      return null
    })
  }, [onConnect])

  // pointerup global — única fuente de verdad
  useEffect(() => {
    if (!drag) return
    const handleUp = () => commitDrag()
    window.addEventListener('pointerup', handleUp)
    return () => window.removeEventListener('pointerup', handleUp)
  }, [drag, commitDrag])

  return { drag, startDrag, moveDrag, registerTarget }
}