"use client"

import { Box, Typography } from "@mui/material"
import Header from "../components/Header"
import Sidebar from "../components/SideNavbar"

// Import the redesigned components
import BowlMetricsCards from "./_components/BowlMetricsCards"
import UserBowlBalanceTable from "./_components/UserBowlBalanceTable"
import BowlTransactionHistoryTable from "./_components/BowlTransactionHistoryTable"

const drawerWidth = 240

export default function BowlsPage() {
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          ml: { xs: 0, sm: `${drawerWidth}px` },
          mt: { xs: "56px", sm: "64px" },
          overflow: "hidden",
        }}
      >
        {/* Content Container with Scroll */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            overflow: "auto",
            height: "100%",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Page Header */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "#000000",
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                lineHeight: 1.2,
              }}
            >
              Bowls Overview
            </Typography>
          </Box>

          {/* Metrics Cards Section */}
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <BowlMetricsCards />
          </Box>

          {/* User Bowl Balance Table */}
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <UserBowlBalanceTable />
          </Box>

          {/* Bowl Transaction History Table */}
          <Box>
            <BowlTransactionHistoryTable />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
