"use client"
import { Box, Typography, Card, CardContent } from "@mui/material"
import { TrendingUp, TrendingDown } from "@mui/icons-material"
import { ResponsiveContainer, PieChart, Pie } from "recharts"

function CustomerStatusCard({ 
  title, 
  percentage, 
  count, 
  trend, 
  isActive = true 
}) {
  const color = isActive ? "#00c17c" : "#da1818"
  const TrendIcon = trend > 0 ? TrendingUp : TrendingDown
  const trendColor = trend > 0 ? "#00c17c" : "#da1818"

  const data = [
    { value: percentage, fill: color },
    { value: 100 - percentage, fill: "#f0f0f0" },
  ]

  return (
    <Card sx={{ flex: 1, bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px", width: "100%" }}>
      <CardContent sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: "14px" }}>
          {title}
        </Typography>
        <Box sx={{ position: "relative", display: "inline-flex", mb: 2, width: 80, height: 80 }}>
          <ResponsiveContainer width={80} height={80}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={35}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                strokeWidth={0}
              />
            </PieChart>
          </ResponsiveContainer>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Typography 
              sx={{ 
                fontWeight: "bold", 
                color,
                fontSize: "18px",
                lineHeight: 1,
              }}
            >
              {percentage}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: "#8a8a8f", mb: 1, fontSize: "11px" }}>
          {title} ({count})
        </Typography>
        {trend !== 0 && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendIcon sx={{ width: 12, height: 12, color: trendColor, mr: 0.5 }} />
            <Typography variant="body2" sx={{ color: trendColor, fontSize: "11px" }}>
              {Math.abs(trend)}%
            </Typography>
          </Box>
        )}
        {trend === 0 && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingDown sx={{ width: 12, height: 12, color: "#8a8a8f", mr: 0.5 }} />
            <Typography variant="body2" sx={{ color: "#8a8a8f", fontSize: "11px" }}>
              0%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default function CustomerStatusCards({ 
  activeCount = 0,
  inactiveCount = 0
}) {
  const total = activeCount + inactiveCount || 1 // Avoid division by zero
  const activePercentage = Math.round((activeCount / total) * 100)
  const inactivePercentage = Math.round((inactiveCount / total) * 100)
  
  // For trends, we can set to 0 or calculate from historical data if available
  const activeTrend = 0
  const inactiveTrend = 0

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        width: "100%",
      }}
    >
      <CustomerStatusCard
        title="Active Customer"
        percentage={activePercentage}
        count={activeCount}
        trend={activeTrend}
        isActive={true}
      />
      <CustomerStatusCard
        title="Inactive Customer"
        percentage={inactivePercentage}
        count={inactiveCount}
        trend={inactiveTrend}
        isActive={false}
      />
    </Box>
  )
}