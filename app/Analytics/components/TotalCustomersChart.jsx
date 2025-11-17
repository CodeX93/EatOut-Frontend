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

  const handlePeriodChange = (event) => {
    const newPeriod = event.target.value
    setSelectedPeriod(newPeriod)
    if (onPeriodChange) {
      onPeriodChange(newPeriod)
    }
  }

  return (
    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px", width: "100%" }}>
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
        {data.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="body2" sx={{ color: "#8a8a8f" }}>
              No customer data available
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
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
                          {label}: {payload[0]?.value}
                        </Box>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="customers" fill="#da1818" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}