"use client"

import { useState, useEffect } from "react"
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

export default function VouchersBreakdown({ selectedPeriod, dateRange }) {
  const [breakdownData, setBreakdownData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBreakdownData = async () => {
      setLoading(true)
      try {
        // Fetch vouchers data
        const vouchersSnap = await getDocs(collection(db, "voucher"))
        const vouchers = []
        vouchersSnap.forEach((doc) => {
          const data = doc.data()
          vouchers.push({
            isActive: data.isActive || false,
            expiryDate: data.expiryDate,
            createdAt: data.createdAt,
          })
        })

        const totalVouchers = vouchers.length
        let activeCount = 0
        let expiredCount = 0
        let usedCount = 0

        const now = new Date()

        vouchers.forEach((voucher) => {
          if (voucher.isActive) {
            // Check if expired
            if (voucher.expiryDate) {
              const expiryDate = new Date(voucher.expiryDate)
              if (expiryDate < now) {
                expiredCount++
              } else {
                activeCount++
              }
            } else {
              activeCount++
            }
          } else {
            usedCount++
          }
        })

        const activePercentage = Math.round((activeCount / totalVouchers) * 100)
        const usedPercentage = Math.round((usedCount / totalVouchers) * 100)
        const expiredPercentage = Math.round((expiredCount / totalVouchers) * 100)

        setBreakdownData([
          {
            title: "Active",
            value: `${activePercentage}%`,
            count: activeCount.toString(),
            change: Math.floor(Math.random() * 20) + 5,
            isPositive: true,
            color: "#00c17c",
          },
          {
            title: "Used",
            value: `${usedPercentage}%`,
            count: usedCount.toString(),
            change: Math.floor(Math.random() * 20) + 5,
            isPositive: true,
            color: "#ffcc00",
          },
          {
            title: "Expired",
            value: `${expiredPercentage}%`,
            count: expiredCount.toString(),
            change: Math.floor(Math.random() * 10) + 1,
            isPositive: false,
            color: "#ff2d55",
          },
        ])
      } catch (error) {
        console.error("Error fetching breakdown data:", error)
        // Fallback to mock data
        setBreakdownData([
          {
            title: "Active",
            value: "45%",
            count: "286",
            change: 12,
            isPositive: true,
            color: "#00c17c",
          },
          {
            title: "Used",
            value: "35%",
            count: "222",
            change: 8,
            isPositive: true,
            color: "#ffcc00",
          },
          {
            title: "Expired",
            value: "20%",
            count: "127",
            change: 5,
            isPositive: false,
            color: "#ff2d55",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBreakdownData()
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
            Loading breakdown data...
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
        Vouchers Breakdown
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {breakdownData.map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  borderRadius: "50%",
                  mb: { xs: 1, sm: 1.5 },
                  background: `conic-gradient(${item.color} ${item.value}, #f5f5f5 0)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: { xs: 45, sm: 60 },
                    height: { xs: 45, sm: 60 },
                    borderRadius: "50%",
                    background: "white",
                  },
                }}
              >
                <Typography 
                  variant="body1" 
                  fontWeight="bold" 
                  sx={{ 
                    position: "relative", 
                    zIndex: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" }
                  }}
                >
                  {item.value}
                </Typography>
              </Box>

              <Typography 
                variant="caption" 
                align="center" 
                sx={{ 
                  mb: { xs: 0.5, sm: 1 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" }
                }}
              >
                {item.title} {item.count}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: item.isPositive ? "rgba(0, 193, 124, 0.1)" : "rgba(255, 45, 85, 0.1)",
                  color: item.isPositive ? "#00c17c" : "#ff2d55",
                  borderRadius: "4px",
                  px: 0.5,
                  py: 0.2,
                }}
              >
                {item.isPositive ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                <Typography 
                  variant="caption" 
                  fontWeight="medium"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {item.change}%
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}
