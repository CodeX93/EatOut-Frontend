"use client"

import { Box, Paper, Typography } from "@mui/material"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "00:00", value: 400 },
  { time: "02:00", value: 300 },
  { time: "04:00", value: 200 },
  { time: "06:00", value: 278 },
  { time: "08:00", value: 189 },
  { time: "10:00", value: 239 },
  { time: "12:00", value: 349 },
  { time: "14:00", value: 400 },
  { time: "16:00", value: 320 },
  { time: "18:00", value: 280 },
  { time: "20:00", value: 250 },
  { time: "22:00", value: 200 },
]

export default function PeakHoursChart() {
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
        Peak Hours
      </Typography>

      <Box sx={{ width: "100%", height: { xs: 250, sm: 300 } }}>
        <ResponsiveContainer>
          <AreaChart
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
              dataKey="time"
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
            <Area
              type="monotone"
              dataKey="value"
              stroke="#da1818"
              fill="#da1818"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
