import { useState, useEffect, useCallback } from 'react'
import type { SavedAgent } from '../types'

const STORAGE_KEY = 'savedAgents'

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const ensureId = (agent: SavedAgent | Omit<SavedAgent, 'id'>): SavedAgent => {
  if ('id' in agent && agent.id) return agent
  return { id: createId(), ...agent }
}

export function useSavedAgents() {
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedAgent[]
        const normalized = parsed.map((agent) => ensureId(agent))
        setSavedAgents(normalized)
        if (normalized.some((agent, index) => agent.id !== parsed[index]?.id)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
        }
      } catch (e) {
        console.error('Failed to parse saved agents', e)
      }
    }
  }, [])

  const saveAgent = useCallback((agent: Omit<SavedAgent, 'id'>) => {
    setSavedAgents((prev) => {
      const updated = [...prev, ensureId(agent)]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const deleteAgent = useCallback((idToRemove: string) => {
    setSavedAgents((prev) => {
      const updated = prev.filter((agent) => agent.id !== idToRemove)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    setSavedAgents([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { savedAgents, saveAgent, deleteAgent, clearAll }
}
