"use client"
import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
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

// Import analytics utilities
import {
  fetchAnalyticsData,
  calculateTotalMetrics,
  calculateMonthlyRevenue,
  calculateMonthlyMetrics,
  calculateEarnedVouchers,
  getTopCustomers,
  getRecentRedemptions,
  calculateCustomerStatus,
  calculateCustomersGrowth,
} from "./utils/analyticsUtils"
import { testFirebaseConnection } from "./utils/firebaseTest"

const drawerWidth = 240

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [topMetrics, setTopMetrics] = useState([])
  const [bottomMetrics, setBottomMetrics] = useState([])
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([])
  const [earnedVouchersData, setEarnedVouchersData] = useState({})
  const [topCustomers, setTopCustomers] = useState([])
  const [recentRedemptions, setRecentRedemptions] = useState([])
  const [customerStatus, setCustomerStatus] = useState({ active: 0, inactive: 0 })
  const [customersGrowth, setCustomersGrowth] = useState([])

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)

      // Test Firebase connection first
      console.log("Testing Firebase connection...")
      await testFirebaseConnection()

      // Fetch all data from Firebase
      console.log("Fetching analytics data from Firebase...")
      const data = await fetchAnalyticsData()
      console.log("Fetched data:", data)
      setAnalyticsData(data)

      // Calculate metrics
      const totalMetrics = calculateTotalMetrics(data)
      console.log("Total metrics:", totalMetrics)
      
      const monthlyMetrics = calculateMonthlyMetrics(data)
      console.log("Monthly metrics:", monthlyMetrics)
      
      const monthlyRevenue = calculateMonthlyRevenue(data)
      console.log("Monthly revenue:", monthlyRevenue)
      
      const earnedVouchers = calculateEarnedVouchers(data)
      console.log("Earned vouchers:", earnedVouchers)
      
      const customers = getTopCustomers(data)
      console.log("Top customers:", customers)
      
      const redemptions = getRecentRedemptions(data)
      console.log("Recent redemptions:", redemptions)
      
      const status = calculateCustomerStatus(data)
      console.log("Customer status:", status)
      
      const growth = calculateCustomersGrowth(data)
      console.log("Customers growth:", growth)

      // Set top metrics
      setTopMetrics([
        {
          icon: <MonetizationOn />,
          title: "Total Revenue",
          value: `$${Number(totalMetrics.totalRevenue).toLocaleString()}`,
          trend: `${Math.abs(totalMetrics.revenueTrend)}%`,
          trendDirection: totalMetrics.revenueTrend >= 0 ? "up" : "down",
          trendText: `${totalMetrics.revenueTrend >= 0 ? "+" : ""}${totalMetrics.revenueTrend}% this week`,
        },
        {
          icon: <TrendingFlat />,
          title: "Total Profit",
          value: `$${Number(totalMetrics.totalProfit).toLocaleString()}`,
          trend: `${Math.abs(totalMetrics.profitTrend)}%`,
          trendDirection: totalMetrics.profitTrend >= 0 ? "up" : "down",
          trendText: `${totalMetrics.profitTrend >= 0 ? "+" : ""}${totalMetrics.profitTrend}% this week`,
        },
        {
          icon: <Store />,
          title: "Total Restaurant",
          value: totalMetrics.totalRestaurants.toString(),
          trend: "0%",
          trendDirection: "up",
          trendText: "Active restaurants",
        },
        {
          icon: <Groups />,
          title: "Total Members",
          value: totalMetrics.totalMembers.toLocaleString(),
          trend: "0%",
          trendDirection: "up",
          trendText: "Registered members",
        },
      ])

      // Set bottom metrics
      setBottomMetrics([
        {
          icon: <MonetizationOn />,
          title: "Average Revenue",
          value: `$${Number(monthlyMetrics.averageRevenue).toLocaleString()}`,
          trend: `${Math.abs(monthlyMetrics.monthlyTrend)}%`,
          trendDirection: monthlyMetrics.monthlyTrend >= 0 ? "up" : "down",
          trendText: `${monthlyMetrics.monthlyTrend >= 0 ? "+" : ""}${monthlyMetrics.monthlyTrend}% vs last month`,
        },
        {
          icon: <TrendingDown />,
          title: "Monthly Expense",
          value: `$${Number(monthlyMetrics.monthlyExpense).toLocaleString()}`,
          trend: "0%",
          trendDirection: "up",
          trendText: "Current month",
        },
        {
          icon: <TrendingUp />,
          title: "Monthly Income",
          value: `$${Number(monthlyMetrics.monthlyIncome).toLocaleString()}`,
          trend: `${Math.abs(monthlyMetrics.monthlyTrend)}%`,
          trendDirection: monthlyMetrics.monthlyTrend >= 0 ? "up" : "down",
          trendText: `${monthlyMetrics.monthlyTrend >= 0 ? "+" : ""}${monthlyMetrics.monthlyTrend}% vs last month`,
        },
        {
          icon: <TrendingFlat />,
          title: "Monthly Profit",
          value: `$${Number(monthlyMetrics.monthlyProfit).toLocaleString()}`,
          trend: `${Math.abs(monthlyMetrics.monthlyTrend)}%`,
          trendDirection: monthlyMetrics.monthlyTrend >= 0 ? "up" : "down",
          trendText: `${monthlyMetrics.monthlyTrend >= 0 ? "+" : ""}${monthlyMetrics.monthlyTrend}% vs last month`,
        },
      ])

      setMonthlyRevenueData(monthlyRevenue)
      setEarnedVouchersData(earnedVouchers)
      setTopCustomers(customers)
      setRecentRedemptions(redemptions)
      setCustomerStatus(status)
      setCustomersGrowth(growth)
    } catch (error) {
      console.error("Error loading analytics data:", error)
      // Set fallback data when there's an error
      setTopMetrics([
        {
          icon: <MonetizationOn />,
          title: "Total Revenue",
          value: "$0",
          trend: "0%",
          trendDirection: "up",
          trendText: "No data available",
        },
        {
          icon: <TrendingFlat />,
          title: "Total Profit",
          value: "$0",
          trend: "0%",
          trendDirection: "up",
          trendText: "No data available",
        },
        {
          icon: <Store />,
          title: "Total Restaurant",
          value: "0",
          trend: "0%",
          trendDirection: "up",
          trendText: "No data available",
        },
        {
          icon: <Groups />,
          title: "Total Members",
          value: "0",
          trend: "0%",
          trendDirection: "up",
          trendText: "No data available",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ color: "#da1818", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#8a8a8f" }}>
              Loading analytics data...
            </Typography>
          </Box>
        </Box>
      </AppLayout>
    )
  }

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
              <MonthlyRevenueChart data={monthlyRevenueData} />
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
              <EarnedVouchersChart
                data={earnedVouchersData.data}
                totalEarned={earnedVouchersData.totalEarned}
                growthPercentage={earnedVouchersData.growthPercentage}
                changeAmount={earnedVouchersData.changeAmount}
                changePercentage={earnedVouchersData.changePercentage}
              />
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
              <TopCustomersTable customers={topCustomers} />
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
              <CustomerStatusCards
                activeCount={customerStatus.active}
                inactiveCount={customerStatus.inactive}
              />
            </Box>

            {/* Total Customers Chart */}
            <Box
              sx={{
                mb: { xs: 2, md: 3 },
                overflow: "hidden",
              }}
            >
              <TotalCustomersChart data={customersGrowth} />
            </Box>

            {/* Recent Redeemed Vouchers */}
            <Box>
              <RecentVouchersTable redemptions={recentRedemptions} />
            </Box>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  )
}
