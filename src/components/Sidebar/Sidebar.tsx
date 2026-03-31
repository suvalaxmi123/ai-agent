import { useMemo, useState } from 'react'
import DraggableItem from './DraggableItem'
import type { AgentData } from '../../types'

interface SidebarProps {
  data: AgentData
  selectedProfile: string
  selectedSkills: string[]
  selectedLayers: string[]
  selectedProvider: string
}

const AI_PROVIDERS = [
  { id: 'gemini', name: 'Gemini', description: 'Google\'s advanced AI model' },
  { id: 'chatgpt', name: 'ChatGPT', description: 'OpenAI\'s conversational AI' },
  { id: 'kimi', name: 'Kimi', description: 'Moonshot AI\'s assistant' },
  { id: 'claude', name: 'Claude', description: 'Anthropic\'s helpful AI' },
  { id: 'deepseek', name: 'DeepSeek', description: 'DeepSeek\'s reasoning model' },
]

type CategoryKey = 'profiles' | 'skills' | 'layers' | 'providers'

const CATEGORY_META: Record<CategoryKey, { icon: string; label: string; color: string }> = {
  profiles: { icon: '👤', label: 'Base Profiles', color: '#8b5cf6' },
  skills: { icon: '⚡', label: 'Skills', color: '#06b6d4' },
  layers: { icon: '🧠', label: 'Personality Layers', color: '#f59e0b' },
  providers: { icon: '🔌', label: 'AI Providers', color: '#10b981' },
}

export default function Sidebar({
  data,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
}: SidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<CategoryKey | null>('profiles')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleCategory = (cat: CategoryKey) => {
    setExpandedCategory((prev) => (prev === cat ? null : cat))
  }

  const filterItems = <T extends { name: string; description?: string }>(items: T[]): T[] => {
    if (!searchQuery.trim()) return items
    const q = searchQuery.toLowerCase()
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    )
  }

  const filteredProfiles = useMemo(() => filterItems(data.agentProfiles), [data.agentProfiles, searchQuery])
  const filteredSkills = useMemo(() => filterItems(data.skills), [data.skills, searchQuery])
  const filteredLayers = useMemo(() => filterItems(data.layers), [data.layers, searchQuery])
  const filteredProviders = useMemo(() => filterItems(AI_PROVIDERS), [searchQuery])

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Components</h2>
        <p className="sidebar-subtitle">Drag items to build your agent</p>
      </div>

      <div className="sidebar-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="sidebar-categories">
        {(Object.entries(CATEGORY_META) as [CategoryKey, typeof CATEGORY_META[CategoryKey]][]).map(
          ([key, meta]) => {
            const isExpanded = expandedCategory === key
            let count = 0
            if (key === 'profiles') count = filteredProfiles.length
            else if (key === 'skills') count = filteredSkills.length
            else if (key === 'layers') count = filteredLayers.length
            else count = filteredProviders.length

            return (
              <div key={key} className={`category ${isExpanded ? 'expanded' : ''}`}>
                <button
                  className="category-header"
                  onClick={() => toggleCategory(key)}
                  style={{ '--cat-color': meta.color } as React.CSSProperties}
                >
                  <div className="category-header-left">
                    <span className="category-icon">{meta.icon}</span>
                    <span className="category-label">{meta.label}</span>
                    <span className="category-count">{count}</span>
                  </div>
                  <svg
                    className={`chevron ${isExpanded ? 'rotated' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="category-items">
                    {key === 'profiles' &&
                      filteredProfiles.map((p) => (
                        <DraggableItem
                          key={p.id}
                          id={p.id}
                          type="profile"
                          name={p.name}
                          description={p.description}
                          isSelected={selectedProfile === p.id}
                        />
                      ))}

                    {key === 'skills' &&
                      filteredSkills.map((s) => (
                        <DraggableItem
                          key={s.id}
                          id={s.id}
                          type="skill"
                          name={s.name}
                          description={s.description}
                          category={s.category}
                          isSelected={selectedSkills.includes(s.id)}
                        />
                      ))}

                    {key === 'layers' &&
                      filteredLayers.map((l) => (
                        <DraggableItem
                          key={l.id}
                          id={l.id}
                          type="layer"
                          name={l.name}
                          description={l.description}
                          category={l.type}
                          isSelected={selectedLayers.includes(l.id)}
                        />
                      ))}

                    {key === 'providers' &&
                      filteredProviders.map((prov) => (
                        <DraggableItem
                          key={prov.id}
                          id={prov.id}
                          type="provider"
                          name={prov.name}
                          description={prov.description}
                          isSelected={selectedProvider === prov.id}
                        />
                      ))}

                    {count === 0 && (
                      <p className="no-results">No items match your search</p>
                    )}
                  </div>
                )}
              </div>
            )
          }
        )}
      </div>
    </aside>
  )
}
