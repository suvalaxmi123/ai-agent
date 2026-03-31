import { useMemo, useState } from 'react'
import DroppableZone from './DroppableZone'
import { showToast } from '../common/ToastContainer'
import type { AgentData } from '../../types'

interface BuilderProps {
  data: AgentData
  selectedProfile: string
  selectedSkills: string[]
  selectedLayers: string[]
  selectedProvider: string
  agentName: string
  onAgentNameChange: (name: string) => void
  onRemoveProfile: () => void
  onRemoveSkill: (skillId: string) => void
  onRemoveLayer: (layerId: string) => void
  onRemoveProvider: () => void
  onSave: () => void
}

const AI_PROVIDERS: Record<string, string> = {
  gemini: 'Gemini',
  chatgpt: 'ChatGPT',
  kimi: 'Kimi',
  claude: 'Claude',
  deepseek: 'DeepSeek',
}

export default function Builder({
  data,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  agentName,
  onAgentNameChange,
  onRemoveProfile,
  onRemoveSkill,
  onRemoveLayer,
  onRemoveProvider,
  onSave,
}: BuilderProps) {
  const [isShaking, setIsShaking] = useState(false)

  const profileById = useMemo(() => {
    return new Map(data.agentProfiles.map((profile) => [profile.id, profile]))
  }, [data])
  const skillById = useMemo(() => {
    return new Map(data.skills.map((skill) => [skill.id, skill]))
  }, [data])
  const layerById = useMemo(() => {
    return new Map(data.layers.map((layer) => [layer.id, layer]))
  }, [data])

  const profileInfo = profileById.get(selectedProfile)
  const hasConfig = selectedProfile || selectedSkills.length > 0 || selectedLayers.length > 0 || selectedProvider

  const handleSave = () => {
    if (!agentName.trim()) {
      showToast('Please enter a name for your agent', 'error')
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 600)
      return
    }
    onSave()
  }

  return (
    <section className="builder">
      <div className="builder-header">
        <h2 className="builder-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#builderGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="builderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          Agent Configuration
        </h2>
        {hasConfig && (
          <span className="config-badge">
            {[
              selectedProfile ? 1 : 0,
              selectedSkills.length,
              selectedLayers.length,
              selectedProvider ? 1 : 0,
            ].reduce((a, b) => a + b, 0)}{' '}
            items
          </span>
        )}
      </div>

      <div className="builder-zones">
        {/* Profile Zone */}
        <DroppableZone
          id="drop-profile"
          accepts="profile"
          label="Base Profile"
          icon="👤"
          isEmpty={!selectedProfile}
        >
          {profileInfo && (
            <div className="selected-chip chip-profile">
              <div className="chip-content">
                <strong>{profileInfo.name}</strong>
                <span className="chip-desc">{profileInfo.description}</span>
              </div>
              <button className="chip-remove" onClick={onRemoveProfile} title="Remove profile">
                ✕
              </button>
            </div>
          )}
        </DroppableZone>

        {/* Skills Zone */}
        <DroppableZone
          id="drop-skill"
          accepts="skill"
          label="Skills"
          icon="⚡"
          isEmpty={selectedSkills.length === 0}
        >
          <div className="chips-grid">
            {selectedSkills.map((skillId) => {
              const skill = skillById.get(skillId)
              return (
                <div key={skillId} className="selected-chip chip-skill">
                  <div className="chip-content">
                    <strong>{skill?.name}</strong>
                    {skill?.category && <span className="chip-badge">{skill.category}</span>}
                  </div>
                  <button className="chip-remove" onClick={() => onRemoveSkill(skillId)} title="Remove skill">
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </DroppableZone>

        {/* Layers Zone */}
        <DroppableZone
          id="drop-layer"
          accepts="layer"
          label="Personality Layers"
          icon="🧠"
          isEmpty={selectedLayers.length === 0}
        >
          <div className="chips-grid">
            {selectedLayers.map((layerId) => {
              const layer = layerById.get(layerId)
              return (
                <div key={layerId} className="selected-chip chip-layer">
                  <div className="chip-content">
                    <strong>{layer?.name}</strong>
                    {layer?.type && <span className="chip-badge">{layer.type}</span>}
                  </div>
                  <button className="chip-remove" onClick={() => onRemoveLayer(layerId)} title="Remove layer">
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </DroppableZone>

        {/* Provider Zone */}
        <DroppableZone
          id="drop-provider"
          accepts="provider"
          label="AI Provider"
          icon="🔌"
          isEmpty={!selectedProvider}
        >
          {selectedProvider && (
            <div className="selected-chip chip-provider">
              <div className="chip-content">
                <strong>{AI_PROVIDERS[selectedProvider] || selectedProvider}</strong>
              </div>
              <button className="chip-remove" onClick={onRemoveProvider} title="Remove provider">
                ✕
              </button>
            </div>
          )}
        </DroppableZone>
      </div>

      {/* Save Section */}
      <div className="save-section">
        <div className={`save-input-group ${isShaking ? 'shake' : ''}`}>
          <input
            type="text"
            placeholder="Name your agent..."
            value={agentName}
            onChange={(e) => onAgentNameChange(e.target.value)}
            className="save-input"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button className="save-btn" onClick={handleSave}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Agent
          </button>
        </div>
      </div>
    </section>
  )
}
