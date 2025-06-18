"use client"

import { Box, Paper, Typography, useTheme } from "@mui/material"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", current: 4000, lastYear: 2400 },
  { name: "Feb", current: 3000, lastYear: 1398 },
  { name: "Mar", current: 2000, lastYear: 9800 },
  { name: "Apr", current: 2780, lastYear: 3908 },
  { name: "May", current: 1890, lastYear: 4800 },
  { name: "Jun", current: 2390, lastYear: 3800 },
  { name: "Jul", current: 3490, lastYear: 4300 },
  { name: "Aug", current: 3490, lastYear: 4300 },
  { name: "Sep", current: 3490, lastYear: 4300 },
  { name: "Oct", current: 3490, lastYear: 4300 },
]

export default function OverviewChart() {
  const theme = useTheme()

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: "10px",
        height: "100%",
        minHeight: { xs: 250, sm: 300 },
        bgcolor: "#ffffff",
        border: "1px solid #efeff4",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: "1rem", sm: "1.25rem" },
          fontWeight: 600,
        }}
      >
        Overview Chart
      </Typography>

      <Box sx={{ width: "100%", height: { xs: 250, sm: 300 } }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              stroke="#666"
              fontSize={12}
              tick={{ fill: "#666" }}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tick={{ fill: "#666" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #efeff4",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#da1818"
              strokeWidth={2}
              dot={{ fill: "#da1818", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="lastYear"
              stroke="#666"
              strokeWidth={2}
              dot={{ fill: "#666", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
