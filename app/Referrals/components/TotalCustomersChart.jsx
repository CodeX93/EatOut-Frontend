"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Card, CardContent, FormControl, Select, MenuItem } from "@mui/material"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { KeyboardArrowDown } from "@mui/icons-material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

export default function TotalCustomersChart() {
  const [filter, setFilter] = useState("Monthly")
  const [totalCustomersData, setTotalCustomersData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, "referrals"))
        const allReferred = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (Array.isArray(data.referredUsers)) {
            data.referredUsers.forEach((ru) => {
              allReferred.push(ru)
            })
          }
        })
        // Group by month for current and previous year
        const now = new Date()
        const months = []
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const m = d.toLocaleString("default", { month: "short" })
          const y = d.getFullYear()
          months.push({ month: m, year: y })
        }
        // Helper to get month/year from a date
        const getMonthYear = (date) => {
          const d = new Date(date)
          return {
            month: d.toLocaleString("default", { month: "short" }),
            year: d.getFullYear(),
          }
        }
        // Count users per month for current and previous year
        const monthMap = {}
        const prevYearMap = {}
        allReferred.forEach((user) => {
          let date = null
          if (user.joinedOn) {
            // Try to parse joinedOn as date string
            date = new Date(user.joinedOn)
            if (isNaN(date)) date = null
          }
          if (!date && user.createdAt && user.createdAt.seconds) {
            date = new Date(user.createdAt.seconds * 1000)
          }
          if (date && !isNaN(date)) {
            const { month, year } = getMonthYear(date)
            if (year === now.getFullYear()) {
              const key = `${month}`
              monthMap[key] = (monthMap[key] || 0) + 1
            } else if (year === now.getFullYear() - 1) {
              const key = `${month}`
              prevYearMap[key] = (prevYearMap[key] || 0) + 1
            }
          }
        })
        // Build chart data
        const chartData = months.map(({ month }) => ({
          month,
          current: monthMap[month] || 0,
          previous: prevYearMap[month] || 0,
        }))
        setTotalCustomersData(chartData)
      } catch (error) {
        console.error("Error fetching total customers:", error)
      }
      setLoading(false)
    }
    fetchCustomers()
  }, [])

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
          {loading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
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
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
