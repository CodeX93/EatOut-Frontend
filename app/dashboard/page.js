"use client"

import { useState, useMemo } from "react"
import { 
  Box, 
  FormControl, 
  Grid, 
  MenuItem, 
  Select, 
  Typography, 
  useMediaQuery, 
  useTheme
} from "@mui/material"
import Header from "../components/Header"
import Sidebar from "../components/SideNavbar"
import StatsCards from "./components/statscard"
import OverviewChart from "./components/OverviewCart"
import VoucherCharts from "./components/VoucherChart"
import PeakHoursChart from "./components/PeakHoursChart"
import VouchersPerformance from "./components/VoucherPerformance"
import VouchersBreakdown from "./components/VoucherBreakdown"
import RecentRedeemedVouchers from "./components/RecentRedeemVouchers"

// Utility function to get date range based on selected period
const getDateRange = (period) => {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (period) {
    case "Weekly":
      const startOfWeek = new Date(startOfToday)
      startOfWeek.setDate(startOfToday.getDate() - 6) // Last 7 days including today
      return {
        start: startOfWeek,
        end: now,
        label: "Last 7 days"
      }
    case "Monthly":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return {
        start: startOfMonth,
        end: now,
        label: "This month"
      }
    case "Yearly":
    default:
      const startOfYear = new Date(now.getFullYear(), 0, 1)
      return {
        start: startOfYear,
        end: now,
        label: "This year"
      }
  }
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Yearly")
  const theme = useTheme()
  
  // Memoize the date range to prevent useEffect dependency issues
  const dateRange = useMemo(() => getDateRange(selectedPeriod), [selectedPeriod])
  
  // Multiple breakpoint queries for better responsive control
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"))
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"))

  // Dynamic sidebar width based on screen size
  const getSidebarWidth = () => {
    if (isMobile) return 0 // Hidden on mobile
    if (isTablet) return 200
    return 240
  }

  // Dynamic spacing based on screen size
  const getSpacing = () => {
    if (isMobile) return 1
    if (isTablet) return 2
    return 3
  }

  const sidebarWidth = getSidebarWidth()
  const spacing = getSpacing()

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Header />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          overflow: "hidden",
          mt: { xs: 7, sm: 8 }, // Account for fixed header
          ml: { xs: 0, sm: "240px" }, // Account for sidebar on larger screens
        }}
      >
          <Grid container spacing={spacing}>
            {/* Left Section - More responsive column distribution */}
            <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
              {/* Overview Header with better responsive styling */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  mb: { xs: 1.5, sm: 2, md: 3 },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 1.5, md: 2 },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#000",
                    fontSize: { 
                      xs: "20px", 
                      sm: "24px", 
                      md: "28px", 
                      lg: "32px",
                      xl: "36px" 
                    },
                    lineHeight: 1.2,
                  }}
                >
                  Overview
                </Typography>

                <FormControl 
                  size={isMobile ? "small" : "medium"}
                  sx={{ minWidth: { xs: "100%", sm: 140, md: 160 } }}
                >
                  <Select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    sx={{
                      borderRadius: "8px",
                      bgcolor: "#ffffff",
                      fontSize: { xs: "14px", sm: "16px" },
                      "& .MuiSelect-select": {
                        py: { xs: 1, sm: 1.5 },
                      }
                    }}
                  >
                    <MenuItem value="Yearly">Yearly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Stats Cards with responsive spacing */}
              <Box sx={{ mb: { xs: 1.5, sm: 2, md: 3 } }}>
                <StatsCards selectedPeriod={selectedPeriod} dateRange={dateRange} />
              </Box>

              {/* Main Overview Chart with responsive height */}
              <Box 
                sx={{ 
                  mb: { xs: 1.5, sm: 2, md: 3 },
                  "& > *": {
                    minHeight: { 
                      xs: "250px", 
                      sm: "300px", 
                      md: "350px", 
                      lg: "400px" 
                    }
                  }
                }}
              >
                <OverviewChart selectedPeriod={selectedPeriod} dateRange={dateRange} />
              </Box>

              {/* Voucher Charts Row - Stack on mobile/tablet, side by side on desktop */}
              <Grid 
                container 
                spacing={spacing} 
                sx={{ mb: { xs: 1.5, sm: 2, md: 3 } }}
              >
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <VoucherCharts title="Earned Vouchers" selectedPeriod={selectedPeriod} dateRange={dateRange} />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <VoucherCharts title="Redeemed Vouchers" selectedPeriod={selectedPeriod} dateRange={dateRange} />
                </Grid>
              </Grid>

              {/* Peak Hours Chart with responsive styling */}
              <Box 
                sx={{ 
                  mb: { xs: 1.5, sm: 2, md: 3 },
                  "& > *": {
                    minHeight: { 
                      xs: "200px", 
                      sm: "250px", 
                      md: "300px" 
                    }
                  }
                }}
              >
                <PeakHoursChart selectedPeriod={selectedPeriod} dateRange={dateRange} />
              </Box>
            </Grid>

            {/* Right Section - Better responsive behavior */}
            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row", lg: "column" },
                  gap: { xs: 1.5, sm: 2, md: 3 },
                  "& > *": {
                    flex: { xs: "none", sm: "1", lg: "none" },
                    minWidth: { xs: "100%", sm: "0", lg: "100%" }
                  }
                }}
              >
                {/* Vouchers Performance */}
                <VouchersPerformance selectedPeriod={selectedPeriod} dateRange={dateRange} />

                {/* Vouchers Breakdown */}
                <VouchersBreakdown selectedPeriod={selectedPeriod} dateRange={dateRange} />

                {/* Recent Redeemed Vouchers */}
                <RecentRedeemedVouchers selectedPeriod={selectedPeriod} dateRange={dateRange} />
              </Box>
            </Grid>
          </Grid>

          {/* Add some bottom padding for better mobile scrolling */}
          <Box sx={{ height: { xs: "20px", sm: "40px" } }} />
      </Box>
    </Box>
  )
}