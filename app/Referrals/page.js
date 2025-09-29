"use client"

import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebaseConfig"

// Import your existing components
import AppLayout from "../components/AppLayout"

// Import the new components we created
import MetricsCards from "./components/MetricsCard"
import MonthlyReferralsChart from "./components/MonthlyReferralsChart"
import AllReferredUsersTable from "./components/AllReferredUsersTable"
import ReferredUsersTable from "./components/ReferredUsersTable"
import TotalCustomersChart from "./components/TotalCustomersChart"


export default function ReferralsPage() {
  const [loading, setLoading] = useState(true)
  const [referralsData, setReferralsData] = useState([])

  useEffect(() => {
    const loadReferrals = async () => {
      setLoading(true)
      try {
        const snap = await getDocs(collection(db, "referrals"))
        const referrals = []
        snap.forEach((doc) => {
          const data = doc.data() || {}
          referrals.push({
            id: doc.id,
            email: data.email || "-",
            referralCode: data.referralCode || "-",
            referredUsers: Array.isArray(data.referredUsers) ? data.referredUsers : [],
            totalRewardsEarned: data.totalRewardsEarned || 0,
            vipReferred: data.VipReferred || 0,
            bowls: data.bowls || 0,
            rank: data.rank || "-",
            referralLink: data.referralLink || "-",
            createdAt: data.createdAt,
          })
        })
        setReferralsData(referrals)
      } catch (e) {
        console.error("Failed to load referrals", e)
        setReferralsData([])
      } finally {
        setLoading(false)
      }
    }
    loadReferrals()
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <Box
          sx={{
            flexGrow: 1,
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
              Loading referrals data...
            </Typography>
          </Box>
        </Box>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          pt: { xs: 2.5, sm: 3, md: 3 }, // Added top padding
          pb: { xs: "80px", sm: "100px", md: "120px" }, // Added bottom padding
          overflow: "auto",
          width: "100%",
          minHeight: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 2, sm: 2.5, md: 3 },
            minHeight: "100%",
          }}
        >
          {/* Left Column - Main Content */}
          <Box sx={{ 
            flex: { xs: "1 1 100%", lg: "1 1 66%" }, 
            overflow: "auto", 
            pr: { xs: 0, lg: 1 },
            width: { xs: "100%", lg: "auto" }
          }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                sx={{ 
                  fontWeight: 600, 
                  color: "#000000", 
                  mb: { xs: 2, sm: 2.5, md: 3 }, 
                  mt: { xs: 1, sm: 0, md: 0 }, // Added top margin for mobile
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  lineHeight: 1.2
                }}
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
          <Box sx={{ 
            flex: { xs: "1 1 100%", lg: "1 1 33%" }, 
            overflow: "auto", 
            pl: { xs: 0, lg: 1 },
            width: { xs: "100%", lg: "auto" }
          }}>
            {/* Referred Users Table */}
            <ReferredUsersTable />

            {/* Total Referred Customers Chart */}
            <TotalCustomersChart />
          </Box>
        </Box>
      </Box>
    </AppLayout>
  )
}
