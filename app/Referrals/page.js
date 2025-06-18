"use client"

import { Box, Typography } from "@mui/material"

// Import your existing components
import Header from "../components/Header"
import SideNavBar from "../components/SideNavbar"

// Import the new components we created
import MetricsCards from "./components/MetricsCard"
import MonthlyReferralsChart from "./components/MonthlyReferralsChart"
import AllReferredUsersTable from "./components/AllReferredUsersTable"
import ReferredUsersTable from "./components/ReferredUsersTable"
import TotalCustomersChart from "./components/TotalCustomersChart"

export default function ReferralsPage() {
  return (
    <Box sx={{ display: "flex", bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <SideNavBar />

      {/* Main Content */}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
            height: { lg: "calc(100vh - 120px)" },
            overflow: "hidden",
          }}
        >
          {/* Left Column - Main Content */}
          <Box sx={{ flex: "1 1 66%", overflow: "auto", pr: { xs: 0, lg: 1 } }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "#000000", mb: 3, fontSize: { xs: "24px", sm: "32px" } }}
              >
                Referrals Overview
              </Typography>

              {/* Top Metrics Cards */}
              <MetricsCards />

              {/* Monthly Referrals Chart */}
              <MonthlyReferralsChart />

              {/* All Referred Users Table */}
              <AllReferredUsersTable />
            </Box>
          </Box>

          {/* Right Column */}
          <Box sx={{ flex: "1 1 33%", overflow: "auto", pl: { xs: 0, lg: 1 } }}>
            {/* Referred Users Table */}
            <ReferredUsersTable />

            {/* Total Referred Customers Chart */}
            <TotalCustomersChart />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
