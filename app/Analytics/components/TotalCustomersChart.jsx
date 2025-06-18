"use client"
import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function TotalCustomersChart({ data = [], onPeriodChange }) {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly")

  const defaultData = [
    { month: "Jan", active: 800, inactive: 200 },
    { month: "Feb", active: 850, inactive: 180 },
    { month: "Mar", active: 900, inactive: 150 },
    { month: "Apr", active: 920, inactive: 140 },
    { month: "May", active: 950, inactive: 120 },
    { month: "Jun", active: 980, inactive: 100 },
    { month: "Jul", active: 1000, inactive: 90 },
    { month: "Aug", active: 1020, inactive: 80 },
    { month: "Sep", active: 1050, inactive: 70 },
    { month: "Oct", active: 1080, inactive: 60 },
    { month: "Nov", active: 1100, inactive: 50 },
    { month: "Dec", active: 1120, inactive: 40 },
  ]

  const chartData = data.length > 0 ? data : defaultData

  const handlePeriodChange = (event) => {
    const newPeriod = event.target.value
    setSelectedPeriod(newPeriod)
    if (onPeriodChange) {
      onPeriodChange(newPeriod)
    }
  }

  return (
    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Total Customers
        </Typography>
        <FormControl size="small">
          <Select 
            value={selectedPeriod} 
            onChange={handlePeriodChange}
            sx={{ minWidth: 80, borderRadius: "8px" }}
          >
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <CardContent>
        <Box sx={{ height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={2}
              barSize={8}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#8a8a8f" }}
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
                          px: 1,
                          py: 0.5,
                          borderRadius: "4px",
                          fontSize: "10px",
                        }}
                      >
                        {label}: {payload[0]?.value + payload[1]?.value}
                      </Box>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="active" stackId="a" fill="#da1818" radius={[0, 0, 0, 0]} />
              <Bar dataKey="inactive" stackId="a" fill="#ffcc00" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}