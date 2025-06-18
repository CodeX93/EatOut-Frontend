"use client"
import { Box, Typography, Card, CardContent } from "@mui/material"

// Import recharts components
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function MonthlyRevenueChart({ data = [] }) {
  const defaultData = [
    { month: "Jan", revenue: 7200 },
    { month: "Feb", revenue: 8100 },
    { month: "Mar", revenue: 7800 },
    { month: "Apr", revenue: 8500 },
    { month: "May", revenue: 8900 },
    { month: "Jun", revenue: 9900 },
    { month: "Jul", revenue: 8200 },
    { month: "Aug", revenue: 7900 },
    { month: "Sep", revenue: 8400 },
    { month: "Oct", revenue: 7600 },
  ]

  const chartData = data.length > 0 ? data : defaultData

  return (
    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Monthly Revenue
        </Typography>
        <Box sx={{ height: 300, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ffcc00" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#8a8a8f" }}
              />
              <YAxis hide />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Box
                        sx={{
                          bgcolor: "black",
                          color: "white",
                          px: 1.5,
                          py: 1,
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        ${payload[0]?.value?.toLocaleString()}
                      </Box>
                    )
                  }
                  return null
                }}
              />
              <Area
                key="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#ffcc00"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                dot={{ fill: "#ffcc00", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, fill: "#da1818", stroke: "#fff", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}