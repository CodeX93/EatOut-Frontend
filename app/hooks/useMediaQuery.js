"use client"

import { useMediaQuery as useMuiMediaQuery, useTheme } from "@mui/material"

export function useMediaQuery(query) {
  const theme = useTheme()
  
  try {
    // Handle theme breakpoints
    if (typeof query === 'string' && theme.breakpoints) {
      if (query === 'down(sm)') {
        return useMuiMediaQuery(theme.breakpoints.down('sm'))
      }
      if (query === 'down(md)') {
        return useMuiMediaQuery(theme.breakpoints.down('md'))
      }
      if (query === 'up(lg)') {
        return useMuiMediaQuery(theme.breakpoints.up('lg'))
      }
      if (query === 'up(md)') {
        return useMuiMediaQuery(theme.breakpoints.up('md'))
      }
      if (query === 'between(sm,md)') {
        return useMuiMediaQuery(theme.breakpoints.between('sm', 'md'))
      }
    }
    
    // Fallback to direct media query
    return useMuiMediaQuery(query)
  } catch (error) {
    // Fallback for compatibility issues
    console.warn('useMediaQuery compatibility issue:', error)
    return false
  }
}
