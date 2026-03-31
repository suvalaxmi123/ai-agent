import { useState, useEffect, useCallback } from 'react'
import type { AgentData } from '../types'

export function useAgentData() {
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate network delay (1 to 3 seconds)
      const delay = Math.floor(Math.random() * 2000) + 1000
      await new Promise((resolve) => setTimeout(resolve, delay))

      const response = await fetch('/data.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const jsonData: AgentData = await response.json()
      setData(jsonData)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch agent data'
      console.error('Error fetching data:', err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch data only once on mount — no unnecessary re-fetches
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
