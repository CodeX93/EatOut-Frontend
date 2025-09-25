"use client"

import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebaseConfig"

// Import your existing components
import Header from "../components/Header"
import SideNavBar from "../components/SideNavbar"

// Import the new components we created
import MetricsCards from "./components/MetricsCard"
import MonthlyReferralsChart from "./components/MonthlyReferralsChart"
import AllReferredUsersTable from "./components/AllReferredUsersTable"
import ReferredUsersTable from "./components/ReferredUsersTable"
import TotalCustomersChart from "./components/TotalCustomersChart"

const drawerWidth = 240

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
      <Box
        sx={{
          display: "flex",
          bgcolor: "#f9f9f9",
          minHeight: "100vh",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Header />
        <SideNavBar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100%",
            ml: { xs: 0, sm: `${drawerWidth}px` },
            mt: { xs: "56px", sm: "64px" },
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ color: "#da1818", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#8a8a8f" }}>
              Loading referrals data...
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

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
