import { useMemo } from 'react'
import type { AgentData, SavedAgent } from '../../types'

interface SavedAgentsProps {
  agents: SavedAgent[]
  data: AgentData | null
  onLoad: (agent: SavedAgent) => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

const AI_PROVIDERS: Record<string, string> = {
  gemini: 'Gemini',
  chatgpt: 'ChatGPT',
  kimi: 'Kimi',
  claude: 'Claude',
  deepseek: 'DeepSeek',
}

export default function SavedAgents({ agents, data, onLoad, onDelete, onClearAll }: SavedAgentsProps) {
  if (agents.length === 0) return null

  const profileNameById = useMemo(() => {
    if (!data) return new Map<string, string>()
    return new Map(data.agentProfiles.map((profile) => [profile.id, profile.name]))
  }, [data])

  return (
    <section className="saved-agents">
      <div className="saved-agents-header">
        <div className="saved-agents-title-group">
          <h2 className="saved-agents-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            Saved Agents
          </h2>
          <span className="saved-count">{agents.length}</span>
        </div>
        <button
          className="clear-all-btn"
          onClick={() => {
            if (confirm('Are you sure you want to clear all saved agents?')) {
              onClearAll()
            }
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Clear All
        </button>
      </div>

      <div className="saved-agents-grid">
        {agents.map((agent) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-card-header">
              <h3 className="agent-card-name">
                <span className="agent-avatar">
                  {agent.name.charAt(0).toUpperCase()}
                </span>
                {agent.name}
              </h3>
            </div>

            <div className="agent-card-stats">
              <div className="stat">
                <span className="stat-icon">👤</span>
                <span className="stat-value">
                  {profileNameById.get(agent.profileId) || 'None'}
                </span>
              </div>
              <div className="stat">
                <span className="stat-icon">⚡</span>
                <span className="stat-value">{agent.skillIds?.length || 0} skills</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🧠</span>
                <span className="stat-value">{agent.layerIds?.length || 0} layers</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🔌</span>
                <span className="stat-value">{AI_PROVIDERS[agent.provider || ''] || agent.provider || 'None'}</span>
              </div>
            </div>

            <div className="agent-card-actions">
              <button className="load-btn" onClick={() => onLoad(agent)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Load
              </button>
              <button className="delete-btn" onClick={() => onDelete(agent.id)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
