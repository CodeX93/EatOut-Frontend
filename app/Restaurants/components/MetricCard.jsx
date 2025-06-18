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
    <Card 
      sx={{ 
        flex: 1, 
        bgcolor: "#ffffff", 
        border: "1px solid #dadada", 
        borderRadius: "12px",
        minWidth: { xs: "100%", sm: "200px" },
        height: { xs: "auto", sm: "120px" },
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, height: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: { xs: 0.5, sm: 1 } }}>
          {icon && (
            <Box sx={{ 
              width: { xs: 14, sm: 16 }, 
              height: { xs: 14, sm: 16 }, 
              color: "#8a8a8f" 
            }}>
              {icon}
            </Box>
          )}
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#8a8a8f",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: "bold", 
            color: "#000000", 
            mb: { xs: 0.5, sm: 1 },
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
        <Box sx={{ 
          display: "flex", 
          alignItems: "center",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: { xs: 0.25, sm: 0.5 },
        }}>
          <Box sx={{ color: getTrendColor(), mr: 0.5 }}>
            {getTrendIcon()}
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: getTrendColor(), 
              mr: 0.5,
              fontSize: { xs: "0.7rem", sm: "0.875rem" },
            }}
          >
            {trend}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#8a8a8f",
              fontSize: { xs: "0.7rem", sm: "0.875rem" },
              lineHeight: 1.2,
            }}
          >
            {trendText}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
