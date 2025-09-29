"use client"
import { Box, Typography } from "@mui/material"
import { MonetizationOn, TrendingFlat, Store, Groups, TrendingDown, TrendingUp } from "@mui/icons-material"

// Import all the modular components
import MetricCard from "./components/MetricCard"
import MonthlyRevenueChart from "./components/MonthlyRevenueChart"
import EarnedVouchersChart from "./components/EarnedVouchersChart"
import TopCustomersTable from "./components/TopCustomersTable"
import CustomerStatusCards from "./components/CustomerStatusCards"
import TotalCustomersChart from "./components/TotalCustomersChart"
import RecentVouchersTable from "./components/RecentVouchersTable"
import AppLayout from "../components/AppLayout"

const drawerWidth = 240

export default function Analytics() {
  // Sample data - in a real app, this would come from props or API calls
  const topMetrics = [
    {
      icon: <MonetizationOn />,
      title: "Total Revenue",
      value: "$89,900",
      trend: "12%",
      trendDirection: "up",
      trendText: "+12% this week",
    },
    {
      icon: <TrendingFlat />,
      title: "Total Profit",
      value: "$243,00",
      trend: "12%",
      trendDirection: "down",
      trendText: "+17% this week",
    },
    {
      icon: <Store />,
      title: "Total Restaurant",
      value: "323",
      trend: "31%",
      trendDirection: "up",
      trendText: "+0.49% this week",
    },
    {
      icon: <Groups />,
      title: "Total Members",
      value: "4,834",
      trend: "17%",
      trendDirection: "up",
      trendText: "+0.17% this week",
    },
  ]

  const bottomMetrics = [
    {
      icon: <MonetizationOn />,
      title: "Average Revenue",
      value: "$9,500",
      trend: "12%",
      trendDirection: "up",
      trendText: "+12% this week",
    },
    {
      icon: <TrendingDown />,
      title: "Monthly Expense",
      value: "$3,000",
      trend: "3.1%",
      trendDirection: "up",
      trendText: "+0.49% this week",
    },
    {
      icon: <TrendingUp />,
      title: "Monthly Income",
      value: "$9,900",
      trend: "12%",
      trendDirection: "down",
      trendText: "+12% this week",
    },
    {
      icon: <TrendingFlat />,
      title: "Monthly Profit",
      value: "$7,500",
      trend: "17%",
      trendDirection: "up",
      trendText: "+0.17% this week",
    },
  ]

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
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "#000000",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                }}
              >
                Analytics Overview
              </Typography>
            </Box>

            {/* Top 4 Metric Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "repeat(4, 1fr)",
                },
                gap: { xs: 1, sm: 1.5, md: 2 },
                mb: { xs: 2, md: 3 },
              }}
            >
              {topMetrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  icon={metric.icon}
                  title={metric.title}
                  value={metric.value}
                  trend={metric.trend}
                  trendDirection={metric.trendDirection}
                  trendText={metric.trendText}
                />
              ))}
            </Box>

            {/* Monthly Revenue Chart */}
            <Box
              sx={{
                mb: { xs: 2, md: 3 },
                overflow: "hidden", // Prevent horizontal scroll on mobile
              }}
            >
              <MonthlyRevenueChart />
            </Box>

            {/* Bottom 4 Metric Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "repeat(4, 1fr)",
                },
                gap: { xs: 1, sm: 1.5, md: 2 },
                mb: { xs: 2, md: 3 },
              }}
            >
              {bottomMetrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  icon={metric.icon}
                  title={metric.title}
                  value={metric.value}
                  trend={metric.trend}
                  trendDirection={metric.trendDirection}
                  trendText={metric.trendText}
                />
              ))}
            </Box>

            {/* Earned Vouchers */}
            <Box sx={{ overflow: "hidden" }}>
              <EarnedVouchersChart />
            </Box>
          </Box>

          {/* Right Column */}
          <Box
            sx={{
              flex: { lg: "1 1 33%" },
              width: { xs: "100%", lg: "33%" },
            }}
          >
            {/* Top Customers */}
            <Box
              sx={{
                mb: { xs: 2, md: 3 },
                overflow: "hidden",
              }}
            >
              <TopCustomersTable />
            </Box>

            {/* Active vs Inactive Customers */}
            <Box
              sx={{
                mb: { xs: 2, md: 3 },
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr" },
                gap: { xs: 1, sm: 2 },
              }}
            >
              <CustomerStatusCards />
            </Box>

            {/* Total Customers Chart */}
            <Box
              sx={{
                mb: { xs: 2, md: 3 },
                overflow: "hidden",
              }}
            >
              <TotalCustomersChart />
            </Box>

            {/* Recent Redeemed Vouchers */}
            <Box sx={{ overflow: "hidden" }}>
              <RecentVouchersTable />
            </Box>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  )
}
