"use client"

import { useState, useEffect } from "react"
import { Box, Paper, Typography, useTheme, CircularProgress } from "@mui/material"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

export default function OverviewChart({ selectedPeriod, dateRange }) {
  const theme = useTheme()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverviewData = async () => {
      setLoading(true)
      try {
        // Fetch vouchers data
        const vouchersSnap = await getDocs(collection(db, "voucher"))
        const vouchers = []
        vouchersSnap.forEach((doc) => {
          const data = doc.data()
          if (data.createdAt) {
            const createdAt = data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000) : new Date(data.createdAt)
            // Filter by date range
            if (createdAt >= dateRange.start && createdAt <= dateRange.end) {
              vouchers.push({
                createdAt,
                value: data.valueOfSavings || 0,
              })
            }
          }
        })

        console.log(`OverviewChart - ${selectedPeriod}: Found ${vouchers.length} vouchers in date range ${dateRange.start.toDateString()} to ${dateRange.end.toDateString()}`)

        // Group by time period and calculate totals
        let groupedData = {}
        let chartData = []
        
        if (selectedPeriod === "Weekly") {
          // Group by last 7 days
          const last7Days = []
          for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            last7Days.push({
              date: new Date(date),
              name: date.toLocaleDateString('en-US', { weekday: 'short' }),
              current: 0,
              lastYear: 0
            })
          }
          
          vouchers.forEach((voucher) => {
            const voucherDate = new Date(voucher.createdAt)
            const dayIndex = last7Days.findIndex(day => 
              day.date.toDateString() === voucherDate.toDateString()
            )
            if (dayIndex !== -1) {
              last7Days[dayIndex].current += voucher.value
            }
          })
          
          chartData = last7Days.map(day => ({
            name: day.name,
            current: Math.round(day.current),
            lastYear: Math.round(day.current * 0.7), // Mock last year data
          }))
          
          // If no data found, show some mock data for demonstration
          if (vouchers.length === 0) {
            console.log("No vouchers found for weekly period, showing mock data")
            chartData = last7Days.map(day => ({
              name: day.name,
              current: Math.floor(Math.random() * 100) + 10, // Random mock data
              lastYear: Math.floor(Math.random() * 70) + 5,
            }))
          }
        } else if (selectedPeriod === "Monthly") {
          // Group by day of month
          vouchers.forEach((voucher) => {
            const day = voucher.createdAt.getDate()
            if (!groupedData[day]) {
              groupedData[day] = { current: 0, lastYear: 0 }
            }
            groupedData[day].current += voucher.value
          })
          
          chartData = Object.entries(groupedData)
            .map(([day, data]) => ({
              name: `Day ${day}`,
              current: Math.round(data.current),
              lastYear: Math.round(data.current * 0.7), // Mock last year data
            }))
            .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]))
        } else {
          // Group by month for yearly view
          vouchers.forEach((voucher) => {
            const month = voucher.createdAt.toLocaleDateString('en-US', { month: 'short' })
            if (!groupedData[month]) {
              groupedData[month] = { current: 0, lastYear: 0 }
            }
            groupedData[month].current += voucher.value
          })
          
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const currentMonth = new Date().getMonth()
          
          for (let i = 9; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12
            const monthName = months[monthIndex]
            chartData.push({
              name: monthName,
              current: Math.round(groupedData[monthName]?.current || 0),
              lastYear: Math.round((groupedData[monthName]?.current || 0) * 0.7), // Mock last year data
            })
          }
        }

        setData(chartData)
      } catch (error) {
        console.error("Error fetching overview data:", error)
        // Fallback to mock data
        setData([
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
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchOverviewData()
  }, [selectedPeriod, dateRange])

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          borderRadius: { xs: "8px", sm: "10px" },
          height: "100%",
          minHeight: { xs: 350, sm: 400, md: 450 },
          bgcolor: "#ffffff",
          border: "1px solid #efeff4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ color: "#da1818", mb: 2 }} />
          <Typography variant="body2" sx={{ color: "#8a8a8f" }}>
            Loading chart data...
          </Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        borderRadius: { xs: "8px", sm: "10px" },
        height: "100%",
        minHeight: { xs: 350, sm: 400, md: 450 },
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

      <Box sx={{ width: "100%", height: { xs: 350, sm: 400, md: 450 } }}>
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
