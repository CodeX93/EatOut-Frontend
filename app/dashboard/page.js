"use client"

import { useState } from "react"
import { 
  Box, 
  FormControl, 
  Grid, 
  MenuItem, 
  Select, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Container
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

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Yearly")
  const theme = useTheme()
  
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
          width: {
            xs: "100%",
            sm: "100%", 
            md: `calc(100% - ${sidebarWidth}px)`,
          },
          ml: {
            xs: 0,
            md: `${sidebarWidth}px`
          },
          mt: {
            xs: "56px", // Smaller header on mobile
            sm: "64px",
            md: "64px"
          },
          bgcolor: "#f9f9f9",
          overflow: "auto",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Use Container for better content width management */}
        <Container
          maxWidth={false}
          sx={{
            px: { 
              xs: 1, 
              sm: 2, 
              md: 3, 
              lg: 4,
              xl: 5 
            },
            py: { 
              xs: 1, 
              sm: 2, 
              md: 3 
            },
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
                <StatsCards />
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
                <OverviewChart />
              </Box>

              {/* Voucher Charts Row - Stack on mobile/tablet, side by side on desktop */}
              <Grid 
                container 
                spacing={spacing} 
                sx={{ mb: { xs: 1.5, sm: 2, md: 3 } }}
              >
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <VoucherCharts title="Earned Vouchers" />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <VoucherCharts title="Redeemed Vouchers" />
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
                <PeakHoursChart />
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
                <VouchersPerformance />

                {/* Vouchers Breakdown */}
                <VouchersBreakdown />

                {/* Recent Redeemed Vouchers */}
                <RecentRedeemedVouchers />
              </Box>
            </Grid>
          </Grid>

          {/* Add some bottom padding for better mobile scrolling */}
          <Box sx={{ height: { xs: "20px", sm: "40px" } }} />
        </Container>
      </Box>
    </Box>
  )
}