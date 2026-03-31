import { useDroppable } from '@dnd-kit/core'
import type { DragItemType } from '../../types'

interface DroppableZoneProps {
  id: string
  accepts: DragItemType
  label: string
  icon: string
  children: React.ReactNode
  isEmpty: boolean
}

export default function DroppableZone({ id, accepts, label, icon, children, isEmpty }: DroppableZoneProps) {
  const { isOver, setNodeRef, active } = useDroppable({
    id,
    data: { accepts },
  })

  const activeType = active?.data?.current?.type as DragItemType | undefined
  const canDrop = activeType === accepts
  const isActiveOver = isOver && canDrop

  return (
    <div
      ref={setNodeRef}
      className={`droppable-zone ${isActiveOver ? 'drop-active' : ''} ${canDrop && active ? 'can-drop' : ''} ${isEmpty ? 'empty' : ''}`}
      data-accepts={accepts}
    >
      <div className="zone-header">
        <span className="zone-icon">{icon}</span>
        <span className="zone-label">{label}</span>
      </div>
      <div className="zone-content">
        {isEmpty ? (
          <div className="zone-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 4"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>Drag & drop {label.toLowerCase()} here</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
