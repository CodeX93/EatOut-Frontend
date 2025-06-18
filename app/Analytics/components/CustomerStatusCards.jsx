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
    <Card sx={{ flex: 1, bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px" }}>
      <CardContent sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: "14px" }}>
          {title}
        </Typography>
        <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
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
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", color }}>
              {percentage}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: "#8a8a8f", mb: 1, fontSize: "11px" }}>
          {title} ({count})
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TrendIcon sx={{ width: 12, height: 12, color: trendColor, mr: 0.5 }} />
          <Typography variant="body2" sx={{ color: trendColor, fontSize: "11px" }}>
            {Math.abs(trend)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function CustomerStatusCards({ 
  activePercentage = 75, 
  activeCount = 900, 
  activeTrend = 17,
  inactivePercentage = 25, 
  inactiveCount = 100, 
  inactiveTrend = -17 
}) {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <CustomerStatusCard
        title="Active Customer"
        percentage={activePercentage}
        count={activeCount}
        trend={activeTrend}
        isActive={true}
      />
      <CustomerStatusCard
        title="In Active Customer"
        percentage={inactivePercentage}
        count={inactiveCount}
        trend={inactiveTrend}
        isActive={false}
      />
    </Box>
  )
}