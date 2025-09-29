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
import AppLayout from "../components/AppLayout"
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


  return (
    <AppLayout>
      <Box
        sx={{
          flex: 1,
          p: { xs: 1, sm: 2, md: 3 },
          overflow: "auto",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 2, md: 3 },
          }}
        >
          {/* Left Column */}
          <Box
            sx={{
              flex: { lg: "1 1 66%" },
              width: { xs: "100%", lg: "66%" },
            }}
          >
            <Box sx={{ mb: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  mb: { xs: 2, md: 3 },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 1.5, md: 2 },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#da1818",
                    fontSize: { 
                      xs: "1.5rem", 
                      sm: "1.75rem", 
                      md: "2rem", 
                      lg: "2.25rem",
                      xl: "2.5rem" 
                    },
                    lineHeight: 1.2,
                    mt: { xs: 1, sm: 0, md: 0 },
                  }}
                >
                  Overview
                </Typography>

                <FormControl 
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    minWidth: { xs: "100%", sm: 140, md: 160 },
                    width: { xs: "100%", sm: "auto" }
                  }}
                >
                  <Select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    sx={{
                      borderRadius: { xs: "6px", sm: "8px" },
                      bgcolor: "#ffffff",
                      fontSize: { xs: "13px", sm: "14px", md: "16px" },
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
            </Box>

            {/* Stats Cards */}
            <Box sx={{ 
              mb: { xs: 2, md: 3 },
              width: "100%",
            }}>
              <StatsCards selectedPeriod={selectedPeriod} dateRange={dateRange} />
            </Box>

            {/* Main Overview Chart */}
            <Box 
              sx={{ 
                mb: { xs: 2, md: 3 },
                "& > *": {
                  minHeight: { 
                    xs: "250px", 
                    sm: "300px", 
                    md: "350px" 
                  }
                }
              }}
            >
              <OverviewChart selectedPeriod={selectedPeriod} dateRange={dateRange} />
            </Box>

            {/* Voucher Charts Row */}
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 2, md: 3 },
                mb: { xs: 2, md: 3 }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <VoucherCharts title="Earned Vouchers" selectedPeriod={selectedPeriod} dateRange={dateRange} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <VoucherCharts title="Redeemed Vouchers" selectedPeriod={selectedPeriod} dateRange={dateRange} />
              </Box>
            </Box>

            {/* Peak Hours Chart */}
            <Box 
              sx={{ 
                mb: { xs: 2, md: 3 },
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
          </Box>

          {/* Right Column */}
          <Box
            sx={{
              flex: { lg: "1 1 33%" },
              width: { xs: "100%", lg: "33%" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row", lg: "column" },
                gap: { xs: 2, md: 3 },
              }}
            >
              {/* Vouchers Performance */}
              <VouchersPerformance selectedPeriod={selectedPeriod} dateRange={dateRange} />

              {/* Vouchers Breakdown */}
              <VouchersBreakdown selectedPeriod={selectedPeriod} dateRange={dateRange} />

              {/* Recent Redeemed Vouchers */}
              <RecentRedeemedVouchers selectedPeriod={selectedPeriod} dateRange={dateRange} />
            </Box>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  )
}