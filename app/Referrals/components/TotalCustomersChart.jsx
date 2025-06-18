"use client"

import { useState } from "react"
import { Box, Typography, Card, CardContent, FormControl, Select, MenuItem } from "@mui/material"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { KeyboardArrowDown } from "@mui/icons-material"

export default function TotalCustomersChart() {
  const [filter, setFilter] = useState("Monthly")

  const totalCustomersData = [
    { month: "Jan", current: 45, previous: 38 },
    { month: "Feb", current: 52, previous: 42 },
    { month: "Mar", current: 48, previous: 45 },
    { month: "Apr", current: 58, previous: 50 },
    { month: "May", current: 62, previous: 55 },
    { month: "Jun", current: 68, previous: 60 },
    { month: "Jul", current: 55, previous: 48 },
    { month: "Aug", current: 50, previous: 45 },
    { month: "Sep", current: 65, previous: 58 },
    { month: "Oct", current: 70, previous: 62 },
    { month: "Nov", current: 58, previous: 52 },
    { month: "Dec", current: 60, previous: 55 },
  ]

  return (
    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px", height: "fit-content" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          pb: 1,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#da1818", fontSize: { xs: "14px", sm: "16px" } }}>
          Total Referred Customers
        </Typography>
        <FormControl size="small">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              minWidth: { xs: 80, sm: 100 },
              borderRadius: "8px",
              fontSize: { xs: "11px", sm: "12px" },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#dadada",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#dadada",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#dadada",
              },
              ".MuiSvgIcon-root": {
                color: "#666666",
              },
            }}
            IconComponent={KeyboardArrowDown}
          >
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <CardContent sx={{ pt: 0, pb: 2 }}>
        <Box sx={{ height: { xs: 200, sm: 250 } }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={totalCustomersData}
              margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              barGap={1}
              barSize={8}
            >
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8a8a8f" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8a8a8f" }} domain={[0, 80]} />
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
              <Bar dataKey="current" fill="#da1818" radius={[1, 1, 0, 0]} />
              <Bar dataKey="previous" fill="#ffcc00" radius={[1, 1, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}
