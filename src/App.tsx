import { useState, useEffect, useCallback } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import Builder from './components/Builder/Builder'
import SavedAgents from './components/SavedAgents/SavedAgents'
import LoadingSpinner from './components/common/LoadingSpinner'
import ToastContainer, { showToast } from './components/common/ToastContainer'
import { useAgentData } from './hooks/useAgentData'
import { useSavedAgents } from './hooks/useSavedAgents'
import type { DragData, DragItemType, SavedAgent } from './types'
import './index.css'

function App() {
  const { data, loading, error, refetch } = useAgentData()
  const { savedAgents, saveAgent, deleteAgent, clearAll } = useSavedAgents()

  type ThemeMode = 'dark' | 'light'
  const getInitialTheme = (): ThemeMode => {
    if (typeof window === 'undefined') return 'dark'
    const stored = window.localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') return stored
    const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches
    return prefersLight ? 'light' : 'dark'
  }
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)

  // Selection states
  const [selectedProfile, setSelectedProfile] = useState<string>('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [agentName, setAgentName] = useState('')

  // Drag state for overlay
  const [activeItem, setActiveItem] = useState<DragData | null>(null)

  // BUG FIX #3: Analytics useEffect with proper dependency
  // The original had an empty deps array, causing a stale closure over agentName
  useEffect(() => {
    const analyticsInterval = setInterval(() => {
      if (agentName !== '') {
        console.log(`[Analytics Heartbeat] User is working on agent named: "${agentName}"`)
      } else {
        console.log(`[Analytics Heartbeat] User is working on an unnamed agent draft...`)
      }
    }, 8000)

    return () => clearInterval(analyticsInterval)
  }, [agentName]) // FIX: Include agentName in deps so the interval always has the latest value

  useEffect(() => {
    document.body.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  // Configure DnD sensors (pointer with a small activation distance)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const dragData = event.active.data.current as DragData
    setActiveItem(dragData)
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveItem(null)

    const { active, over } = event
    if (!over) return

    const dragData = active.data.current as DragData
    const dropAccepts = over.data.current?.accepts as DragItemType | undefined

    // Verify the drop zone accepts this type
    if (dropAccepts && dropAccepts !== dragData.type) return

    switch (dragData.type) {
      case 'profile':
        setSelectedProfile(dragData.id)
        showToast(`Profile "${dragData.name}" selected`, 'success')
        break
      case 'skill':
        // BUG FIX #1 (pattern): Using immutable state updates with functional form
        setSelectedSkills((prev) => {
          if (prev.includes(dragData.id)) {
            showToast(`"${dragData.name}" is already added`, 'info')
            return prev
          }
          showToast(`Skill "${dragData.name}" added`, 'success')
          return [...prev, dragData.id]
        })
        break
      case 'layer':
        // BUG FIX #1: The original code did selectedLayers.push() which mutates state
        // Now using functional update with spread operator
        setSelectedLayers((prev) => {
          if (prev.includes(dragData.id)) {
            showToast(`"${dragData.name}" is already added`, 'info')
            return prev
          }
          showToast(`Layer "${dragData.name}" added`, 'success')
          return [...prev, dragData.id]
        })
        break
      case 'provider':
        setSelectedProvider(dragData.id)
        showToast(`Provider "${dragData.name}" selected`, 'success')
        break
    }
  }, [])

  const handleSaveAgent = useCallback(() => {
    if (!agentName.trim()) return

    saveAgent({
      name: agentName,
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider,
    })

    showToast(`Agent "${agentName}" saved successfully!`, 'success')
    setAgentName('')
  }, [agentName, selectedProfile, selectedSkills, selectedLayers, selectedProvider, saveAgent])

  const handleLoadAgent = useCallback((agent: SavedAgent) => {
    setSelectedProfile(agent.profileId || '')
    setSelectedSkills([...(agent.skillIds || [])])
    setSelectedLayers([...(agent.layerIds || [])])
    setAgentName(agent.name)
    setSelectedProvider(agent.provider || '')
    showToast(`Agent "${agent.name}" loaded`, 'info')
  }, [])

  const handleDeleteAgent = useCallback((id: string) => {
    deleteAgent(id)
    showToast('Agent deleted', 'info')
  }, [deleteAgent])

  // Error state
  if (error) {
    return (
      <div className="app-container">
        <Header
          onReload={refetch}
          loading={loading}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        />
        <div className="error-container">
          <div className="error-card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h2>Failed to Load Configuration</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={refetch}>Try Again</button>
          </div>
        </div>
        <ToastContainer />
      </div>
    )
  }

  // Loading state
  if (loading && !data) {
    return (
      <div className="app-container">
        <Header
          onReload={refetch}
          loading={loading}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        />
        <LoadingSpinner />
        <ToastContainer />
      </div>
    )
  }

  // No data
  if (!data) {
    return (
      <div className="app-container">
        <Header
          onReload={refetch}
          loading={loading}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        />
        <div className="error-container">
          <p>No data available. Click reload to try again.</p>
        </div>
        <ToastContainer />
      </div>
    )
  }

  return (
    <div className="app-container">
      <Header
        onReload={refetch}
        loading={loading}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      />

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <main className="app-main">
          <Sidebar
            data={data}
            selectedProfile={selectedProfile}
            selectedSkills={selectedSkills}
            selectedLayers={selectedLayers}
            selectedProvider={selectedProvider}
          />
          <Builder
            data={data}
            selectedProfile={selectedProfile}
            selectedSkills={selectedSkills}
            selectedLayers={selectedLayers}
            selectedProvider={selectedProvider}
            agentName={agentName}
            onAgentNameChange={setAgentName}
            onRemoveProfile={() => {
              setSelectedProfile('')
              showToast('Profile removed', 'info')
            }}
            onRemoveSkill={(id) => {
              setSelectedSkills((prev) => prev.filter((s) => s !== id))
              showToast('Skill removed', 'info')
            }}
            onRemoveLayer={(id) => {
              setSelectedLayers((prev) => prev.filter((l) => l !== id))
              showToast('Layer removed', 'info')
            }}
            onRemoveProvider={() => {
              setSelectedProvider('')
              showToast('Provider removed', 'info')
            }}
            onSave={handleSaveAgent}
          />
        </main>

        <DragOverlay dropAnimation={null}>
          {activeItem ? (
            <div className="drag-overlay-item">
              <strong>{activeItem.name}</strong>
              {activeItem.category && <span className="drag-overlay-badge">{activeItem.category}</span>}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <SavedAgents
        agents={savedAgents}
        data={data}
        onLoad={handleLoadAgent}
        onDelete={handleDeleteAgent}
        onClearAll={clearAll}
      />

      <ToastContainer />
    </div>
  )
}

export default App
