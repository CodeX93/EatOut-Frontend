"use client"

import { Box, Typography } from "@mui/material"
import AppLayout from "../components/AppLayout"

// Import the redesigned components
import BowlMetricsCards from "./_components/BowlMetricsCards"
import UserBowlBalanceTable from "./_components/UserBowlBalanceTable"
import BowlTransactionHistoryTable from "./_components/BowlTransactionHistoryTable"


export default function BowlsPage() {
  return (
    <AppLayout>
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          height: "100%",
        }}
      >
        {/* Content Container with Scroll */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 1.5, sm: 2, md: 3 },
            pt: { xs: 2.5, sm: 3, md: 4 }, // Added top padding
            pb: { xs: "80px", sm: "100px", md: "120px" }, // Added bottom padding
            overflow: "auto",
            width: "100%",
            minHeight: "100%",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Page Header */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "#da1818",
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                lineHeight: 1.2,
                mt: { xs: 1, sm: 0, md: 0 }, // Added top margin for mobile
              }}
            >
              Golden Bowls Overview
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
    </AppLayout>
  )
}
