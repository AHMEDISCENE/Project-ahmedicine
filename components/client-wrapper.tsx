"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface ClientWrapperProps {
  children: React.ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Return null on first render to avoid hydration mismatch
  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}
