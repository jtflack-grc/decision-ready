import type { ScenarioCanvas } from '../types'

const STORAGE_KEY = 'decision-ready-risk-scenario-canvas-v1'

export const loadCanvas = (): ScenarioCanvas | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ScenarioCanvas
  } catch {
    return null
  }
}

export const saveCanvas = (canvas: ScenarioCanvas): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(canvas))
}

export const clearCanvas = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

export const storageKey = STORAGE_KEY
