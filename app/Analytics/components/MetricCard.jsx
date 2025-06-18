"use client"
import { Box, Typography, Card, CardContent } from "@mui/material"

export default function MetricCard({ 
  icon, 
  title, 
  value, 
  trend, 
  trendDirection, 
  trendText 
}) {
  const getTrendColor = () => {
    if (trendDirection === 'up') return '#00c17c'
    if (trendDirection === 'down') return '#da1818'
    return '#8a8a8f'
  }

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14l5-5 5 5z"/>
          </svg>
        )
      case 'down':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        )
      default:
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )
    }
  }

  return (
    <Card sx={{ flex: 1, bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px" }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          {icon && (
            <Box sx={{ width: 16, height: 16, color: "#8a8a8f" }}>
              {icon}
            </Box>
          )}
          <Typography variant="body2" sx={{ color: "#8a8a8f" }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000000", mb: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ color: getTrendColor(), mr: 0.5 }}>
            {getTrendIcon()}
          </Box>
          <Typography variant="body2" sx={{ color: getTrendColor(), mr: 0.5 }}>
            {trend}
          </Typography>
          <Typography variant="body2" sx={{ color: "#8a8a8f" }}>
            {trendText}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}