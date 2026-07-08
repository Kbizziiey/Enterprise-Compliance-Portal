import { createContext, useContext, useEffect, useState } from 'react'

const BrandingContext = createContext(null)

// Simple relative-luminance contrast check so brand text stays readable
// against whatever brand color the organization picks.
function getContrastColor(hexColor) {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#111827' : '#FFFFFF'
}

const DEFAULT_BRAND = { color: '#1D4ED8', name: 'Enterprise Compliance Portal' }

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(DEFAULT_BRAND)

  useEffect(() => {
    const stored = localStorage.getItem('ecp_branding')
    if (stored) {
      try {
        setBranding(JSON.parse(stored))
      } catch {
        // ignore malformed stored branding, fall back to default
      }
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-color', branding.color)
    document.documentElement.style.setProperty(
      '--brand-contrast',
      getContrastColor(branding.color)
    )
  }, [branding])

  const updateBranding = (next) => {
    setBranding(next)
    localStorage.setItem('ecp_branding', JSON.stringify(next))
  }

  return (
    <BrandingContext.Provider value={{ branding, updateBranding }}>
      {children}
    </BrandingContext.Provider>
  )
}

export function useBranding() {
  const ctx = useContext(BrandingContext)
  if (!ctx) throw new Error('useBranding must be used within BrandingProvider')
  return ctx
}
