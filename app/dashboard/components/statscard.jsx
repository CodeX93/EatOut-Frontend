"use client"

import { useState, useEffect } from "react"
import { Box, Grid, Paper, Typography, useMediaQuery, useTheme, CircularProgress } from "@mui/material"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

export default function StatsCards({ selectedPeriod, dateRange }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [stats, setStats] = useState([
    { title: "Restaurant Registered", value: "-", change: 0, isPositive: true, comparedTo: "Loading..." },
    { title: "Total Vouchers", value: "-", change: 0, isPositive: true, comparedTo: "Loading..." },
    { title: "Members", value: "-", change: 0, isPositive: true, comparedTo: "Loading..." },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        // Fetch restaurants count
        const restaurantsSnap = await getDocs(collection(db, "registeredRestaurants"))
        const restaurantsCount = restaurantsSnap.size

        // Fetch vouchers count
        const vouchersSnap = await getDocs(collection(db, "voucher"))
        const vouchersCount = vouchersSnap.size

        // Fetch members count
        const membersSnap = await getDocs(collection(db, "members"))
        const membersCount = membersSnap.size

        // Calculate changes (mock calculation for now - you can implement real comparison logic)
        const restaurantChange = Math.floor(Math.random() * 20) + 5 // 5-25% change
        const voucherChange = Math.floor(Math.random() * 20) + 5
        const memberChange = Math.floor(Math.random() * 20) + 5

        setStats([
          {
            title: "Restaurant Registered",
            value: restaurantsCount.toLocaleString(),
            change: restaurantChange,
            isPositive: restaurantChange > 0,
            comparedTo: `Compared to (${Math.floor(restaurantsCount * 0.9)} last period)`,
          },
          {
            title: "Total Vouchers",
            value: vouchersCount.toLocaleString(),
            change: voucherChange,
            isPositive: voucherChange > 0,
            comparedTo: `Compared to (${Math.floor(vouchersCount * 0.9)} last period)`,
          },
          {
            title: "Members",
            value: membersCount.toLocaleString(),
            change: memberChange,
            isPositive: memberChange > 0,
            comparedTo: `Compared to (${Math.floor(membersCount * 0.9)} last period)`,
          },
        ])
      } catch (error) {
        console.error("Error fetching stats:", error)
        setStats([
          { title: "Restaurant Registered", value: "Error", change: 0, isPositive: false, comparedTo: "Failed to load" },
          { title: "Total Vouchers", value: "Error", change: 0, isPositive: false, comparedTo: "Failed to load" },
          { title: "Members", value: "Error", change: 0, isPositive: false, comparedTo: "Failed to load" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [selectedPeriod, dateRange])

  if (loading) {
    return (
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        <Grid item xs={12} sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress sx={{ color: "#da1818", mb: 2 }} />
          <Typography variant="body2" sx={{ color: "#8a8a8f" }}>
            Loading stats...
          </Typography>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2, md: 2.5 },
              borderRadius: { xs: "8px", sm: "10px" },
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#ffffff",
              border: "1px solid #efeff4",
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: "0.875rem", sm: "1rem" },
                mb: { xs: 1, sm: 1.5 }
              }}
            >
              {stat.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 0.5, sm: 1 } }}>
              <Typography 
                variant="h4" 
                component="div" 
                fontWeight="bold" 
                sx={{ 
                  mr: 1,
                  fontSize: { xs: "1.5rem", sm: "2rem" }
                }}
              >
                {stat.value}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: stat.isPositive ? "rgba(0, 193, 124, 0.1)" : "rgba(255, 45, 85, 0.1)",
                  color: stat.isPositive ? "#00c17c" : "#ff2d55",
                  borderRadius: "4px",
                  px: 0.5,
                  py: 0.2,
                }}
              >
                {stat.isPositive ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                <Typography 
                  variant="caption" 
                  fontWeight="medium"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {stat.change}%
                </Typography>
              </Box>
            </Box>

            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                opacity: 0.8
              }}
            >
              {stat.comparedTo}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
