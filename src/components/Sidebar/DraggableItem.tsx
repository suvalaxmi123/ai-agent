import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { DragItemType } from '../../types'

interface DraggableItemProps {
  id: string
  type: DragItemType
  name: string
  description?: string
  category?: string
  isSelected?: boolean
}

export default function DraggableItem({ id, type, name, description, category, isSelected }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${type}-${id}`,
    data: { type, id, name, description, category },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`draggable-item ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
      data-type={type}
    >
      <div className="draggable-item-content">
        <div className="draggable-item-header">
          <span className="draggable-item-name">{name}</span>
          {category && <span className="draggable-item-badge">{category}</span>}
        </div>
        {description && (
          <p className="draggable-item-desc">{description}</p>
        )}
      </div>
      <div className="drag-handle">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
          <circle cx="9" cy="6" r="1.5"/>
          <circle cx="15" cy="6" r="1.5"/>
          <circle cx="9" cy="12" r="1.5"/>
          <circle cx="15" cy="12" r="1.5"/>
          <circle cx="9" cy="18" r="1.5"/>
          <circle cx="15" cy="18" r="1.5"/>
        </svg>
      </div>
      {isSelected && (
        <div className="selected-indicator">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      )}
    </div>
  )
}
