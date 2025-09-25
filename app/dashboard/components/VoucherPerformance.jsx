"use client"

import { useState, useEffect } from "react"
import { Box, Paper, Typography, LinearProgress, CircularProgress } from "@mui/material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

export default function VouchersPerformance({ selectedPeriod, dateRange }) {
  const [performanceData, setPerformanceData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true)
      try {
        // Fetch vouchers data
        const vouchersSnap = await getDocs(collection(db, "voucher"))
        const vouchers = []
        vouchersSnap.forEach((doc) => {
          const data = doc.data()
          vouchers.push({
            voucherType: data.voucherType || "Unknown",
            isActive: data.isActive || false,
            valueOfSavings: data.valueOfSavings || 0,
          })
        })

        // Group by voucher type and calculate performance
        const categoryData = {}
        vouchers.forEach((voucher) => {
          const category = voucher.voucherType
          if (!categoryData[category]) {
            categoryData[category] = { total: 0, active: 0, value: 0 }
          }
          categoryData[category].total += 1
          categoryData[category].value += voucher.valueOfSavings
          if (voucher.isActive) {
            categoryData[category].active += 1
          }
        })

        // Convert to performance data format
        const totalVouchers = vouchers.length
        const performance = Object.entries(categoryData).map(([category, data]) => ({
          category: category,
          percentage: Math.round((data.active / data.total) * 100),
          value: data.active.toString(),
          total: data.total.toString(),
        }))

        // Sort by percentage and take top 3
        performance.sort((a, b) => b.percentage - a.percentage)
        setPerformanceData(performance.slice(0, 3))
      } catch (error) {
        console.error("Error fetching performance data:", error)
        // Fallback to mock data
        setPerformanceData([
          {
            category: "Food & Beverage",
            percentage: 75,
            value: "1,234",
            total: "1,645",
          },
          {
            category: "Retail",
            percentage: 45,
            value: "567",
            total: "1,234",
          },
          {
            category: "Entertainment",
            percentage: 30,
            value: "345",
            total: "1,123",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPerformanceData()
  }, [selectedPeriod, dateRange])

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: "10px",
          height: "100%",
          minHeight: { xs: 300, sm: 350, md: 400 },
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
            Loading performance data...
          </Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: "10px",
        height: "100%",
        minHeight: { xs: 300, sm: 350, md: 400 },
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
        Vouchers Performance
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
        {performanceData.map((item, index) => (
          <Box key={index}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {item.category}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {item.value} / {item.total}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={item.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(218, 24, 24, 0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#da1818",
                  borderRadius: 4,
                },
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.5,
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              {item.percentage}% of total vouchers
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
